package com.globalunionpay.transaction.repository;

import com.globalunionpay.transaction.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Optional<Transaction> findByTransactionId(String transactionId);

    Page<Transaction> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);

    Page<Transaction> findByUserIdAndStatusOrderByCreatedAtDesc(String userId, Transaction.TransactionStatus status, Pageable pageable);

    Page<Transaction> findByUserIdAndTypeOrderByCreatedAtDesc(String userId, Transaction.TransactionType type, Pageable pageable);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.userId = :userId AND t.type = 'DEBIT' AND t.status = 'SUCCESS' AND t.createdAt BETWEEN :from AND :to")
    BigDecimal getTotalDebitBetween(String userId, LocalDateTime from, LocalDateTime to);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.userId = :userId AND t.type = 'CREDIT' AND t.status = 'SUCCESS' AND t.createdAt BETWEEN :from AND :to")
    BigDecimal getTotalCreditBetween(String userId, LocalDateTime from, LocalDateTime to);

    @Query("SELECT t.category, SUM(t.amount) FROM Transaction t WHERE t.userId = :userId AND t.type = 'DEBIT' AND t.status = 'SUCCESS' AND t.createdAt >= :from GROUP BY t.category")
    List<Object[]> getSpendingByCategory(String userId, LocalDateTime from);

    List<Transaction> findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(
            String userId, LocalDateTime from, LocalDateTime to);
}
