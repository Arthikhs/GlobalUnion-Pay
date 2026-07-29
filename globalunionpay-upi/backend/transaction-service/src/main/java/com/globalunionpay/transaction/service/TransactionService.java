package com.globalunionpay.transaction.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.globalunionpay.transaction.model.Transaction;
import com.globalunionpay.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "payment-success", groupId = "transaction-service-group")
    public void onPaymentSuccess(String message) {
        try {
            Map<String, Object> event = objectMapper.readValue(message, Map.class);
            String paymentId = (String) event.get("paymentId");
            String senderUserId = (String) event.get("senderUserId");
            String receiverUserId = (String) event.get("receiverUserId");
            BigDecimal amount = new BigDecimal(event.get("amount").toString());
            String description = (String) event.getOrDefault("description", "UPI Transfer");
            String category = (String) event.getOrDefault("category", "Transfer");

            // Create DEBIT transaction for sender
            createTransaction(senderUserId, receiverUserId, amount,
                    Transaction.TransactionType.DEBIT, Transaction.TransactionStatus.SUCCESS,
                    description, category, paymentId);

            // Create CREDIT transaction for receiver
            if (receiverUserId != null) {
                createTransaction(receiverUserId, senderUserId, amount,
                        Transaction.TransactionType.CREDIT, Transaction.TransactionStatus.SUCCESS,
                        description, category, paymentId);
            }

            log.info("Transactions recorded for payment: {}", paymentId);
        } catch (Exception e) {
            log.error("Failed to process payment-success event", e);
        }
    }

    @KafkaListener(topics = "payment-failed", groupId = "transaction-service-group")
    public void onPaymentFailed(String message) {
        try {
            Map<String, Object> event = objectMapper.readValue(message, Map.class);
            String paymentId = (String) event.get("paymentId");
            String senderUserId = (String) event.get("senderUserId");
            BigDecimal amount = new BigDecimal(event.get("amount").toString());

            createTransaction(senderUserId, null, amount,
                    Transaction.TransactionType.DEBIT, Transaction.TransactionStatus.FAILED,
                    "Failed payment", "Transfer", paymentId);

            log.info("Failed transaction recorded for payment: {}", paymentId);
        } catch (Exception e) {
            log.error("Failed to process payment-failed event", e);
        }
    }

    private void createTransaction(String userId, String counterpartyId, BigDecimal amount,
                                    Transaction.TransactionType type, Transaction.TransactionStatus status,
                                    String description, String category, String paymentId) {
        String txnId = "TXN" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();

        Transaction txn = Transaction.builder()
                .transactionId(txnId)
                .userId(userId)
                .counterpartyUserId(counterpartyId)
                .amount(amount)
                .type(type)
                .status(status)
                .description(description)
                .category(category)
                .paymentId(paymentId)
                .settledAt(status == Transaction.TransactionStatus.SUCCESS ? LocalDateTime.now() : null)
                .build();

        transactionRepository.save(txn);
    }

    public Page<Transaction> getTransactions(String userId, Pageable pageable) {
        return transactionRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    public Page<Transaction> getTransactionsByStatus(String userId, Transaction.TransactionStatus status, Pageable pageable) {
        return transactionRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, status, pageable);
    }

    public Map<String, Object> getMonthlyStats(String userId) {
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime now = LocalDateTime.now();

        BigDecimal totalDebit = transactionRepository.getTotalDebitBetween(userId, startOfMonth, now);
        BigDecimal totalCredit = transactionRepository.getTotalCreditBetween(userId, startOfMonth, now);

        List<Object[]> categoryData = transactionRepository.getSpendingByCategory(userId, startOfMonth);
        Map<String, BigDecimal> spendingByCategory = categoryData.stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0],
                        row -> (BigDecimal) row[1]
                ));

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSpent", totalDebit != null ? totalDebit : BigDecimal.ZERO);
        stats.put("totalReceived", totalCredit != null ? totalCredit : BigDecimal.ZERO);
        stats.put("spendingByCategory", spendingByCategory);
        stats.put("month", startOfMonth.getMonth().toString());
        return stats;
    }

    public Transaction getTransaction(String transactionId) {
        return transactionRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found: " + transactionId));
    }
}
