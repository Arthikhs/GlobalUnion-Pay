package com.globalunionpay.payment.repository;

import com.globalunionpay.payment.model.Payment;
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
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByPaymentId(String paymentId);

    Page<Payment> findBySenderUserIdOrReceiverUserIdOrderByCreatedAtDesc(
            String senderUserId, String receiverUserId, Pageable pageable);

    List<Payment> findBySenderUserIdAndStatusOrderByCreatedAtDesc(String userId, Payment.PaymentStatus status);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.senderUserId = :userId AND p.status = 'SUCCESS' AND p.createdAt >= :from")
    BigDecimal getTotalSpentSince(String userId, LocalDateTime from);

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.senderUserId = :userId AND p.status = 'FAILED' AND p.createdAt >= :from")
    Long countFailedPaymentsSince(String userId, LocalDateTime from);

    List<Payment> findByIsScheduledTrueAndStatusAndScheduledAtBefore(
            Payment.PaymentStatus status, LocalDateTime now);
}
