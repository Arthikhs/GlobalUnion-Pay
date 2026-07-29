package com.globalunionpay.fraud.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class FraudDetectionService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final BigDecimal HIGH_VALUE_THRESHOLD = new BigDecimal("50000");
    private static final int MAX_TRANSACTIONS_PER_HOUR = 20;

    @KafkaListener(topics = "upi-payment-initiated", groupId = "fraud-service-group")
    public void analyzeTransaction(Map<String, Object> event) {
        String txnRef = event.get("transactionRef").toString();
        String senderUpiId = event.get("senderUpiId").toString();
        BigDecimal amount = new BigDecimal(event.get("amount").toString());

        int riskScore = calculateRiskScore(senderUpiId, amount);

        log.info("Fraud analysis | TxnRef: {} | UPI: {} | Amount: {} | RiskScore: {}",
                txnRef, senderUpiId, amount, riskScore);

        if (riskScore >= 80) {
            // High risk — block transaction
            kafkaTemplate.send("fraud-alert", Map.of(
                    "transactionRef", txnRef,
                    "senderUpiId", senderUpiId,
                    "riskScore", riskScore,
                    "action", "BLOCKED",
                    "reason", "High fraud risk detected"
            ));
            log.warn("🚨 HIGH RISK transaction BLOCKED: {} | Score: {}", txnRef, riskScore);
        } else if (riskScore >= 50) {
            // Medium risk — flag for review
            kafkaTemplate.send("fraud-alert", Map.of(
                    "transactionRef", txnRef,
                    "senderUpiId", senderUpiId,
                    "riskScore", riskScore,
                    "action", "FLAGGED",
                    "reason", "Suspicious activity detected"
            ));
            log.warn("⚠️ SUSPICIOUS transaction FLAGGED: {} | Score: {}", txnRef, riskScore);
        }
    }

    private int calculateRiskScore(String senderUpiId, BigDecimal amount) {
        int score = 0;

        // Rule 1: High value transaction
        if (amount.compareTo(HIGH_VALUE_THRESHOLD) > 0) {
            score += 30;
        }

        // Rule 2: Velocity check — too many transactions in 1 hour
        String velocityKey = "FRAUD_VELOCITY:" + senderUpiId;
        Long txnCount = redisTemplate.opsForValue().increment(velocityKey);
        redisTemplate.expire(velocityKey, Duration.ofHours(1));

        if (txnCount != null && txnCount > MAX_TRANSACTIONS_PER_HOUR) {
            score += 40;
        }

        // Rule 3: Unusual hour (midnight transactions)
        int hour = java.time.LocalTime.now().getHour();
        if (hour >= 1 && hour <= 5) {
            score += 20;
        }

        // Rule 4: New device / first transaction
        String firstTxnKey = "FIRST_TXN:" + senderUpiId;
        if (!Boolean.TRUE.equals(redisTemplate.hasKey(firstTxnKey))) {
            score += 10;
            redisTemplate.opsForValue().set(firstTxnKey, "true", Duration.ofDays(30));
        }

        return Math.min(score, 100);
    }
}
