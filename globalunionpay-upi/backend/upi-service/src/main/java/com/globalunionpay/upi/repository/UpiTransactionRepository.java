package com.globalunionpay.upi.repository;

import com.globalunionpay.upi.model.UpiTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UpiTransactionRepository extends JpaRepository<UpiTransaction, Long> {
    Optional<UpiTransaction> findByTransactionRef(String transactionRef);

    @Query("SELECT t FROM UpiTransaction t WHERE t.senderUpiId = :upiId OR t.receiverUpiId = :upiId ORDER BY t.initiatedAt DESC")
    Page<UpiTransaction> findByUpiId(String upiId, Pageable pageable);

    @Query("SELECT COUNT(t) FROM UpiTransaction t WHERE t.senderUpiId = :upiId AND t.initiatedAt >= :since AND t.status = 'SUCCESS'")
    long countSuccessfulTransactionsSince(String upiId, LocalDateTime since);

    @Query("SELECT SUM(t.amount) FROM UpiTransaction t WHERE t.senderUpiId = :upiId AND t.initiatedAt >= :since AND t.status = 'SUCCESS'")
    java.math.BigDecimal sumAmountSince(String upiId, LocalDateTime since);
}
