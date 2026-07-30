package com.globalunionpay.wallet.service;

import com.globalunionpay.wallet.model.Wallet;
import com.globalunionpay.wallet.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class WalletService {

    private final WalletRepository walletRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final RestTemplate restTemplate;

    private static final String BALANCE_CACHE = "WALLET_BALANCE:";
    private static final String USER_SERVICE_URL = "http://user-service:8082";

    @Transactional
    public Wallet createWallet(String userId) {
        Wallet wallet = Wallet.builder()
                .userId(Long.valueOf(userId))
                .balance(BigDecimal.ZERO)
                .lockedBalance(BigDecimal.ZERO)
                .status(Wallet.WalletStatus.ACTIVE)
                .build();
        return walletRepository.save(wallet);
    }

    public BigDecimal getBalance(String userId) {
        Long userIdLong = Long.valueOf(userId);
        String cacheKey = BALANCE_CACHE + userIdLong;
        Object cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return new BigDecimal(cached.toString());
        }

        Wallet wallet = walletRepository.findByUserId(userIdLong)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        redisTemplate.opsForValue().set(cacheKey, wallet.getBalance().toString(), Duration.ofSeconds(30));
        return wallet.getBalance();
    }

    @Transactional
    public boolean deductMoney(String userId, BigDecimal amount) {
        Long userIdLong = Long.valueOf(userId);
        Wallet wallet = walletRepository.findByUserId(userIdLong)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        if (wallet.getBalance().compareTo(amount) < 0) return false;
        wallet.setBalance(wallet.getBalance().subtract(amount));
        walletRepository.save(wallet);
        redisTemplate.delete(BALANCE_CACHE + userIdLong);
        return true;
    }

    @Transactional
    public Map<String, Object> transfer(String senderUserId, String receiverPhone, BigDecimal amount) {
        // 1. Lookup receiver userId from user-service by phone
        String receiverUserId;
        try {
            Map response = restTemplate.getForObject(
                USER_SERVICE_URL + "/api/v1/users/phone/" + receiverPhone, Map.class);
            Map data = (Map) response.get("data");
            receiverUserId = data.get("userId").toString();
        } catch (Exception e) {
            return Map.of("success", false, "message", "Receiver not found. Phone number not registered.");
        }

        Long senderIdLong   = Long.valueOf(senderUserId);
        Long receiverIdLong = Long.valueOf(receiverUserId);

        if (senderIdLong.equals(receiverIdLong))
            return Map.of("success", false, "message", "Cannot transfer to yourself.");

        // 2. Lock both wallets
        Wallet sender = walletRepository.findByUserIdWithLock(senderIdLong)
                .orElseThrow(() -> new RuntimeException("Sender wallet not found"));
        Wallet receiver = walletRepository.findByUserIdWithLock(receiverIdLong)
                .orElseThrow(() -> new RuntimeException("Receiver wallet not found"));

        // 3. Check balance
        if (sender.getBalance().compareTo(amount) < 0)
            return Map.of("success", false, "message", "Insufficient balance");

        // 4. Deduct sender, credit receiver
        sender.setBalance(sender.getBalance().subtract(amount));
        receiver.setBalance(receiver.getBalance().add(amount));
        walletRepository.save(sender);
        walletRepository.save(receiver);

        // 5. Invalidate Redis cache for both
        redisTemplate.delete(BALANCE_CACHE + senderIdLong);
        redisTemplate.delete(BALANCE_CACHE + receiverIdLong);

        // 6. Publish Kafka event
        kafkaTemplate.send("payment-success", Map.of(
            "senderUserId", senderUserId,
            "receiverUserId", receiverUserId,
            "receiverPhone", receiverPhone,
            "amount", amount,
            "status", "SUCCESS"
        ));

        log.info("Transfer SUCCESS: ₹{} from {} to {}", amount, senderUserId, receiverPhone);
        return Map.of("success", true, "message", "Transfer successful",
                "senderBalance", sender.getBalance(),
                "amount", amount);
    }

    @Transactional
    public Map<String, Object> transfer(String senderUserId, String receiverPhone, BigDecimal amount) {
        // 1. Lookup receiver userId from user-service by phone
        String receiverUserId;
        try {
            Map response = restTemplate.getForObject(
                USER_SERVICE_URL + "/api/v1/users/phone/" + receiverPhone, Map.class);
            Map data = (Map) response.get("data");
            receiverUserId = data.get("userId").toString();
        } catch (Exception e) {
            return Map.of("success", false, "message", "Receiver not found. Phone number not registered.");
        }

        Long senderIdLong   = Long.valueOf(senderUserId);
        Long receiverIdLong = Long.valueOf(receiverUserId);

        if (senderIdLong.equals(receiverIdLong))
            return Map.of("success", false, "message", "Cannot transfer to yourself.");

        // 2. Lock both wallets
        Wallet sender = walletRepository.findByUserIdWithLock(senderIdLong)
                .orElseThrow(() -> new RuntimeException("Sender wallet not found"));
        Wallet receiver = walletRepository.findByUserIdWithLock(receiverIdLong)
                .orElseThrow(() -> new RuntimeException("Receiver wallet not found"));

        // 3. Check balance
        if (sender.getBalance().compareTo(amount) < 0)
            return Map.of("success", false, "message", "Insufficient balance");

        // 4. Deduct sender, credit receiver atomically
        sender.setBalance(sender.getBalance().subtract(amount));
        receiver.setBalance(receiver.getBalance().add(amount));
        walletRepository.save(sender);
        walletRepository.save(receiver);

        // 5. Invalidate Redis cache for both
        redisTemplate.delete(BALANCE_CACHE + senderIdLong);
        redisTemplate.delete(BALANCE_CACHE + receiverIdLong);

        // 6. Publish Kafka event
        kafkaTemplate.send("payment-success", Map.of(
            "senderUserId", senderUserId,
            "receiverUserId", receiverUserId,
            "receiverPhone", receiverPhone,
            "amount", amount,
            "status", "SUCCESS"
        ));

        log.info("Transfer SUCCESS: \u20b9{} from {} to {}", amount, senderUserId, receiverPhone);
        return Map.of("success", true, "message", "Transfer successful",
                "senderBalance", sender.getBalance(),
                "amount", amount);
    }

    // Kafka Consumer — listens to UPI payment events and processes balance transfer
    @KafkaListener(topics = "upi-payment-initiated", groupId = "wallet-service-group")
    @Transactional
    public void processUpiPayment(Map<String, Object> event) {
        String transactionRef = (String) event.get("transactionRef");
        Long senderUserId = Long.valueOf(event.get("senderUserId").toString());
        Long receiverUserId = Long.valueOf(event.get("receiverUserId").toString());
        BigDecimal amount = new BigDecimal(event.get("amount").toString());

        log.info("Processing UPI payment: {} | Amount: {}", transactionRef, amount);

        try {
            // Deduct from sender
            Wallet senderWallet = walletRepository.findByUserIdWithLock(senderUserId)
                    .orElseThrow(() -> new RuntimeException("Sender wallet not found"));

            if (senderWallet.getBalance().compareTo(amount) < 0) {
                throw new RuntimeException("Insufficient balance");
            }

            senderWallet.setBalance(senderWallet.getBalance().subtract(amount));
            walletRepository.save(senderWallet);

            // Credit to receiver
            Wallet receiverWallet = walletRepository.findByUserIdWithLock(receiverUserId)
                    .orElseThrow(() -> new RuntimeException("Receiver wallet not found"));

            receiverWallet.setBalance(receiverWallet.getBalance().add(amount));
            walletRepository.save(receiverWallet);

            // Invalidate Redis cache
            redisTemplate.delete(BALANCE_CACHE + senderUserId);
            redisTemplate.delete(BALANCE_CACHE + receiverUserId);

            // Publish success event
            kafkaTemplate.send("payment-success", Map.of(
                    "transactionRef", transactionRef,
                    "senderUserId", senderUserId,
                    "receiverUserId", receiverUserId,
                    "amount", amount,
                    "status", "SUCCESS"
            ));

            log.info("Payment SUCCESS: {} | ₹{} transferred", transactionRef, amount);

        } catch (Exception e) {
            log.error("Payment FAILED: {} | Reason: {}", transactionRef, e.getMessage());

            kafkaTemplate.send("payment-failed", Map.of(
                    "transactionRef", transactionRef,
                    "reason", e.getMessage(),
                    "status", "FAILED"
            ));
        }
    }

    @Transactional
    public void addMoney(String userId, BigDecimal amount) {
        Long userIdLong = Long.valueOf(userId);
        Wallet wallet = walletRepository.findByUserId(userIdLong)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);
        redisTemplate.delete(BALANCE_CACHE + userIdLong);
    }
}
