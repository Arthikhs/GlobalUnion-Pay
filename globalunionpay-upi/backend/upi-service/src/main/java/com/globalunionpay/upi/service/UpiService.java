package com.globalunionpay.upi.service;

import com.globalunionpay.upi.dto.UpiDtos.*;
import com.globalunionpay.upi.model.UpiId;
import com.globalunionpay.upi.model.UpiTransaction;
import com.globalunionpay.upi.repository.UpiIdRepository;
import com.globalunionpay.upi.repository.UpiTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UpiService {

    private final UpiIdRepository upiIdRepository;
    private final UpiTransactionRepository transactionRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final BCryptPasswordEncoder pinEncoder = new BCryptPasswordEncoder();

    @Value("${upi.handle}")
    private String upiHandle;

    @Value("${upi.daily-limit}")
    private BigDecimal dailyLimit;

    @Value("${upi.per-transaction-limit}")
    private BigDecimal perTransactionLimit;

    @Transactional
    public UpiIdResponse createUpiId(Long userId, String phone, String fullName, CreateUpiRequest request) {
        String upiId = request.getUsername().toLowerCase() + "@" + upiHandle;

        if (upiIdRepository.existsByUpiId(upiId)) {
            throw new RuntimeException("UPI ID already taken. Try another username.");
        }

        boolean isPrimary = upiIdRepository.findByUserId(userId).isEmpty();

        UpiId newUpiId = UpiId.builder()
                .upiId(upiId)
                .userId(userId)
                .phone(phone)
                .fullName(fullName)
                .bankAccountId(request.getBankAccountId())
                .primary(isPrimary)
                .status(UpiId.UpiStatus.ACTIVE)
                .build();

        upiIdRepository.save(newUpiId);

        // Publish event
        kafkaTemplate.send("upi-created", Map.of("upiId", upiId, "userId", userId));

        return UpiIdResponse.builder()
                .id(newUpiId.getId())
                .upiId(upiId)
                .primary(isPrimary)
                .status("ACTIVE")
                .build();
    }

    // Validate UPI ID — like PhonePe shows name + photo before payment
    public UpiValidationResponse validateUpiId(String upiId) {
        String cacheKey = "UPI_VALIDATE:" + upiId;
        Object cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return (UpiValidationResponse) cached;
        }

        UpiId found = upiIdRepository.findByUpiId(upiId)
                .orElseThrow(() -> new RuntimeException("UPI ID not found or invalid"));

        if (found.getStatus() != UpiId.UpiStatus.ACTIVE) {
            throw new RuntimeException("UPI ID is not active");
        }

        UpiValidationResponse response = UpiValidationResponse.builder()
                .upiId(found.getUpiId())
                .fullName(found.getFullName())
                .verified(true)
                .upiStatus("ACTIVE")
                .build();

        redisTemplate.opsForValue().set(cacheKey, response,
                java.time.Duration.ofMinutes(10));

        return response;
    }

    // Also validate by phone number — like PhonePe "Pay by phone"
    public UpiValidationResponse validateByPhone(String phone) {
        UpiId found = upiIdRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("No UPI ID linked to this phone number"));

        return UpiValidationResponse.builder()
                .upiId(found.getUpiId())
                .fullName(found.getFullName())
                .verified(true)
                .upiStatus(found.getStatus().name())
                .build();
    }

    @Transactional
    public PaymentResponse initiatePayment(InitiatePaymentRequest request) {
        // 1. Validate sender UPI
        UpiId sender = upiIdRepository.findByUpiId(request.getSenderUpiId())
                .orElseThrow(() -> new RuntimeException("Sender UPI ID not found"));

        // 2. Validate receiver UPI
        UpiId receiver = upiIdRepository.findByUpiId(request.getReceiverUpiId())
                .orElseThrow(() -> new RuntimeException("Receiver UPI ID not found"));

        // 3. Check limits
        validateTransactionLimits(request.getSenderUpiId(), request.getAmount());

        // 4. Verify UPI PIN (in real system, this goes to bank NPCI)
        // Here we simulate PIN verification via Redis stored hash
        verifyUpiPin(sender.getUserId(), request.getUpiPin());

        // 5. Create transaction record
        String txnRef = "GUP" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String rrn = generateRRN();

        UpiTransaction transaction = UpiTransaction.builder()
                .transactionRef(txnRef)
                .senderUpiId(request.getSenderUpiId())
                .receiverUpiId(request.getReceiverUpiId())
                .amount(request.getAmount())
                .note(request.getNote())
                .status(UpiTransaction.TransactionStatus.PROCESSING)
                .type(UpiTransaction.TransactionType.PAY)
                .rrn(rrn)
                .build();

        transactionRepository.save(transaction);

        // 6. Publish to Kafka → Wallet Service deducts/credits balance
        kafkaTemplate.send("upi-payment-initiated", Map.of(
                "transactionRef", txnRef,
                "senderUpiId", request.getSenderUpiId(),
                "receiverUpiId", request.getReceiverUpiId(),
                "senderUserId", sender.getUserId(),
                "receiverUserId", receiver.getUserId(),
                "amount", request.getAmount(),
                "note", request.getNote() != null ? request.getNote() : ""
        ));

        log.info("UPI Payment initiated: {} → {} | Amount: {} | Ref: {}",
                request.getSenderUpiId(), request.getReceiverUpiId(), request.getAmount(), txnRef);

        return PaymentResponse.builder()
                .transactionRef(txnRef)
                .rrn(rrn)
                .status("PROCESSING")
                .amount(request.getAmount())
                .senderUpiId(request.getSenderUpiId())
                .receiverUpiId(request.getReceiverUpiId())
                .message("Payment is being processed")
                .build();
    }

    public List<UpiIdResponse> getUserUpiIds(Long userId) {
        return upiIdRepository.findByUserId(userId).stream()
                .map(u -> UpiIdResponse.builder()
                        .id(u.getId())
                        .upiId(u.getUpiId())
                        .primary(u.isPrimary())
                        .status(u.getStatus().name())
                        .qrCodeUrl(u.getQrCodeUrl())
                        .build())
                .collect(Collectors.toList());
    }

    private void validateTransactionLimits(String senderUpiId, BigDecimal amount) {
        if (amount.compareTo(perTransactionLimit) > 0) {
            throw new RuntimeException("Amount exceeds per transaction limit of ₹" + perTransactionLimit);
        }

        BigDecimal todayTotal = transactionRepository.sumAmountSince(
                senderUpiId, LocalDateTime.now().toLocalDate().atStartOfDay());

        if (todayTotal != null && todayTotal.add(amount).compareTo(dailyLimit) > 0) {
            throw new RuntimeException("Daily UPI limit of ₹" + dailyLimit + " exceeded");
        }
    }

    private void verifyUpiPin(Long userId, String upiPin) {
        String storedPinHash = (String) redisTemplate.opsForValue().get("UPI_PIN:" + userId);
        if (storedPinHash == null || !pinEncoder.matches(upiPin, storedPinHash)) {
            throw new RuntimeException("Invalid UPI PIN");
        }
    }

    private String generateRRN() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmmss"))
                + String.format("%06d", (int) (Math.random() * 1000000));
    }
}
