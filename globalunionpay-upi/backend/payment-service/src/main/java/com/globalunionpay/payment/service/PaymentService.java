package com.globalunionpay.payment.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.globalunionpay.payment.dto.PaymentDtos;
import com.globalunionpay.payment.model.Payment;
import com.globalunionpay.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    public PaymentDtos.PaymentResponse initiatePayment(PaymentDtos.InitiatePaymentRequest request) {
        String paymentId = "PAY" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();

        Payment payment = Payment.builder()
                .paymentId(paymentId)
                .senderUserId(request.getSenderUserId())
                .receiverUpiId(request.getReceiverUpiId())
                .amount(request.getAmount())
                .currency("INR")
                .status(Payment.PaymentStatus.INITIATED)
                .paymentType(request.getPaymentType() != null ? request.getPaymentType() : Payment.PaymentType.UPI)
                .description(request.getDescription())
                .category(request.getCategory())
                .deviceId(request.getDeviceId())
                .ipAddress(request.getIpAddress())
                .retryCount(0)
                .build();

        Payment saved = paymentRepository.save(payment);
        log.info("Payment initiated: {}", paymentId);

        // Publish to Kafka for fraud check
        publishEvent("payment-initiated", paymentId, buildPaymentEvent(saved));

        return mapToResponse(saved);
    }

    public PaymentDtos.PaymentResponse confirmPayment(PaymentDtos.ConfirmPaymentRequest request) {
        Payment payment = paymentRepository.findByPaymentId(request.getPaymentId())
                .orElseThrow(() -> new RuntimeException("Payment not found: " + request.getPaymentId()));

        if (payment.getStatus() != Payment.PaymentStatus.INITIATED) {
            throw new RuntimeException("Payment cannot be confirmed in status: " + payment.getStatus());
        }

        payment.setStatus(Payment.PaymentStatus.PROCESSING);
        paymentRepository.save(payment);

        // Simulate UPI processing (in real: call NPCI/bank APIs)
        processUpiPayment(payment);

        return mapToResponse(payment);
    }

    private void processUpiPayment(Payment payment) {
        try {
            // Simulate processing delay
            String txnId = "UPI" + System.currentTimeMillis();
            String bankRef = "BANK" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

            payment.setStatus(Payment.PaymentStatus.SUCCESS);
            payment.setUpiTransactionId(txnId);
            payment.setBankReferenceNumber(bankRef);
            payment.setCompletedAt(LocalDateTime.now());
            paymentRepository.save(payment);

            // Publish success event to Kafka
            publishEvent("payment-success", payment.getPaymentId(), buildPaymentEvent(payment));

            // Real-time WebSocket notification
            sendWebSocketNotification(payment.getSenderUserId(), "PAYMENT_SUCCESS", payment);

            log.info("Payment processed successfully: {}", payment.getPaymentId());

        } catch (Exception e) {
            payment.setStatus(Payment.PaymentStatus.FAILED);
            payment.setFailureReason(e.getMessage());
            paymentRepository.save(payment);

            publishEvent("payment-failed", payment.getPaymentId(), buildPaymentEvent(payment));
            sendWebSocketNotification(payment.getSenderUserId(), "PAYMENT_FAILED", payment);

            log.error("Payment failed: {}", payment.getPaymentId(), e);
        }
    }

    public PaymentDtos.PaymentResponse schedulePayment(PaymentDtos.SchedulePaymentRequest request) {
        String paymentId = "SCHPAY" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();

        Payment payment = Payment.builder()
                .paymentId(paymentId)
                .senderUserId(request.getSenderUserId())
                .receiverUpiId(request.getReceiverUpiId())
                .amount(request.getAmount())
                .currency("INR")
                .status(Payment.PaymentStatus.SCHEDULED)
                .paymentType(Payment.PaymentType.SCHEDULED)
                .description(request.getDescription())
                .scheduledAt(request.getScheduledAt())
                .isScheduled(true)
                .retryCount(0)
                .build();

        Payment saved = paymentRepository.save(payment);
        log.info("Payment scheduled: {} for {}", paymentId, request.getScheduledAt());
        return mapToResponse(saved);
    }

    @Scheduled(fixedDelay = 60000) // Every minute
    public void processScheduledPayments() {
        List<Payment> due = paymentRepository.findByIsScheduledTrueAndStatusAndScheduledAtBefore(
                Payment.PaymentStatus.SCHEDULED, LocalDateTime.now());
        due.forEach(p -> {
            p.setStatus(Payment.PaymentStatus.PROCESSING);
            paymentRepository.save(p);
            processUpiPayment(p);
            log.info("Processed scheduled payment: {}", p.getPaymentId());
        });
    }

    public Page<PaymentDtos.PaymentResponse> getPaymentHistory(String userId, Pageable pageable) {
        return paymentRepository.findBySenderUserIdOrReceiverUserIdOrderByCreatedAtDesc(userId, userId, pageable)
                .map(this::mapToResponse);
    }

    public PaymentDtos.PaymentResponse getPayment(String paymentId) {
        Payment payment = paymentRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found: " + paymentId));
        return mapToResponse(payment);
    }

    private void publishEvent(String topic, String key, String value) {
        kafkaTemplate.send(topic, key, value);
    }

    private String buildPaymentEvent(Payment payment) {
        try {
            return objectMapper.writeValueAsString(mapToResponse(payment));
        } catch (Exception e) {
            return payment.getPaymentId();
        }
    }

    private void sendWebSocketNotification(String userId, String type, Payment payment) {
        try {
            String message = objectMapper.writeValueAsString(
                    java.util.Map.of("type", type, "payment", mapToResponse(payment)));
            messagingTemplate.convertAndSendToUser(userId, "/queue/notifications", message);
        } catch (Exception e) {
            log.error("WebSocket notification failed", e);
        }
    }

    private PaymentDtos.PaymentResponse mapToResponse(Payment p) {
        return PaymentDtos.PaymentResponse.builder()
                .paymentId(p.getPaymentId())
                .senderUserId(p.getSenderUserId())
                .receiverUserId(p.getReceiverUserId())
                .senderUpiId(p.getSenderUpiId())
                .receiverUpiId(p.getReceiverUpiId())
                .amount(p.getAmount())
                .currency(p.getCurrency())
                .status(p.getStatus())
                .paymentType(p.getPaymentType())
                .description(p.getDescription())
                .category(p.getCategory())
                .upiTransactionId(p.getUpiTransactionId())
                .bankReferenceNumber(p.getBankReferenceNumber())
                .failureReason(p.getFailureReason())
                .createdAt(p.getCreatedAt())
                .completedAt(p.getCompletedAt())
                .build();
    }
}
