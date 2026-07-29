package com.globalunionpay.analytics.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.globalunionpay.analytics.model.AnalyticsEvent;
import com.globalunionpay.analytics.repository.AnalyticsEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AnalyticsService {

    private final AnalyticsEventRepository analyticsEventRepository;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = {"payment-success", "payment-failed", "payment-initiated",
            "user-created", "kyc-submitted", "merchant-registered"}, groupId = "analytics-service-group")
    public void consumeEvent(String message, org.apache.kafka.clients.consumer.ConsumerRecord<String, String> record) {
        try {
            Map<String, Object> event = objectMapper.readValue(message, Map.class);
            String topic = record.topic();

            AnalyticsEvent.EventType eventType = switch (topic) {
                case "payment-success" -> AnalyticsEvent.EventType.PAYMENT_SUCCESS;
                case "payment-failed" -> AnalyticsEvent.EventType.PAYMENT_FAILED;
                case "payment-initiated" -> AnalyticsEvent.EventType.PAYMENT_INITIATED;
                case "user-created" -> AnalyticsEvent.EventType.USER_REGISTERED;
                case "kyc-submitted" -> AnalyticsEvent.EventType.KYC_SUBMITTED;
                case "merchant-registered" -> AnalyticsEvent.EventType.MERCHANT_REGISTERED;
                default -> AnalyticsEvent.EventType.PAYMENT_INITIATED;
            };

            BigDecimal amount = event.containsKey("amount")
                    ? new BigDecimal(event.get("amount").toString()) : BigDecimal.ZERO;

            AnalyticsEvent analyticsEvent = AnalyticsEvent.builder()
                    .userId((String) event.getOrDefault("senderUserId", event.get("userId")))
                    .eventType(eventType)
                    .amount(amount)
                    .category((String) event.getOrDefault("category", "Transfer"))
                    .status(topic.contains("failed") ? AnalyticsEvent.EventStatus.FAILED : AnalyticsEvent.EventStatus.SUCCESS)
                    .metadata(message)
                    .build();

            analyticsEventRepository.save(analyticsEvent);
            log.debug("Analytics event recorded: {}", eventType);
        } catch (Exception e) {
            log.error("Failed to process analytics event", e);
        }
    }

    @Cacheable(value = "dashboardStats", key = "'global'")
    public Map<String, Object> getDashboardStats() {
        LocalDateTime last30Days = LocalDateTime.now().minusDays(30);
        LocalDateTime last7Days = LocalDateTime.now().minusDays(7);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPayments30d", analyticsEventRepository.countByEventTypeSince(
                AnalyticsEvent.EventType.PAYMENT_SUCCESS, last30Days));
        stats.put("totalRevenue30d", analyticsEventRepository.totalRevenueSince(last30Days));
        stats.put("newUsers7d", analyticsEventRepository.countByEventTypeSince(
                AnalyticsEvent.EventType.USER_REGISTERED, last7Days));
        stats.put("failedPayments30d", analyticsEventRepository.countByEventTypeSince(
                AnalyticsEvent.EventType.PAYMENT_FAILED, last30Days));

        List<Object[]> dailyStats = analyticsEventRepository.getDailyPaymentStats(last30Days);
        stats.put("dailyPaymentStats", dailyStats);

        return stats;
    }

    public Map<String, Object> getUserAnalytics(String userId) {
        LocalDateTime last30Days = LocalDateTime.now().minusDays(30);
        List<Object[]> categoryBreakdown = analyticsEventRepository.getCategoryBreakdown(userId, last30Days);

        Map<String, Object> result = new HashMap<>();
        Map<String, Object> categories = new LinkedHashMap<>();
        for (Object[] row : categoryBreakdown) {
            categories.put((String) row[0], Map.of("count", row[1], "amount", row[2]));
        }
        result.put("spendingByCategory", categories);
        result.put("userId", userId);
        result.put("period", "last30days");
        return result;
    }
}
