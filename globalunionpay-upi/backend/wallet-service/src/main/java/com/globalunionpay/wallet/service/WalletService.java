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

    private static final String BALANCE_CACHE = "WALLET_BALANCE:";

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
