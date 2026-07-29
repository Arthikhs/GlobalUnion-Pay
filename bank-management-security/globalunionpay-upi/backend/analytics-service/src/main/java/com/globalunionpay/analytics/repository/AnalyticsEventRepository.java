package com.globalunionpay.analytics.repository;

import com.globalunionpay.analytics.model.AnalyticsEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnalyticsEventRepository extends JpaRepository<AnalyticsEvent, Long> {

    List<AnalyticsEvent> findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(
            String userId, LocalDateTime from, LocalDateTime to);

    @Query("SELECT COUNT(a) FROM AnalyticsEvent a WHERE a.eventType = :type AND a.createdAt >= :from")
    Long countByEventTypeSince(AnalyticsEvent.EventType type, LocalDateTime from);

    @Query("SELECT SUM(a.amount) FROM AnalyticsEvent a WHERE a.eventType = 'PAYMENT_SUCCESS' AND a.createdAt >= :from")
    BigDecimal totalRevenueSince(LocalDateTime from);

    @Query("SELECT a.category, COUNT(a), SUM(a.amount) FROM AnalyticsEvent a WHERE a.userId = :userId AND a.eventType = 'PAYMENT_SUCCESS' AND a.createdAt >= :from GROUP BY a.category")
    List<Object[]> getCategoryBreakdown(String userId, LocalDateTime from);

    @Query("SELECT DATE(a.createdAt), COUNT(a), SUM(a.amount) FROM AnalyticsEvent a WHERE a.eventType = 'PAYMENT_SUCCESS' AND a.createdAt >= :from GROUP BY DATE(a.createdAt) ORDER BY DATE(a.createdAt)")
    List<Object[]> getDailyPaymentStats(LocalDateTime from);
}
