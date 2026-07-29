package com.globalunionpay.notification.service;

import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    // Listen to payment success → push real-time WebSocket notification
    @KafkaListener(topics = "payment-success", groupId = "notification-service-group")
    public void onPaymentSuccess(Map<String, Object> event) {
        Long senderUserId = Long.valueOf(event.get("senderUserId").toString());
        Long receiverUserId = Long.valueOf(event.get("receiverUserId").toString());
        String amount = event.get("amount").toString();
        String txnRef = event.get("transactionRef").toString();

        // Push to sender — "Money Sent"
        NotificationPayload senderNotif = NotificationPayload.builder()
                .type("PAYMENT_SENT")
                .title("Money Sent Successfully! ✅")
                .message("₹" + amount + " sent | Ref: " + txnRef)
                .amount(amount)
                .transactionRef(txnRef)
                .timestamp(LocalDateTime.now().toString())
                .build();

        messagingTemplate.convertAndSendToUser(
                senderUserId.toString(), "/queue/notifications", senderNotif);

        // Push to receiver — "Money Received"
        NotificationPayload receiverNotif = NotificationPayload.builder()
                .type("PAYMENT_RECEIVED")
                .title("Money Received! 💰")
                .message("₹" + amount + " received | Ref: " + txnRef)
                .amount(amount)
                .transactionRef(txnRef)
                .timestamp(LocalDateTime.now().toString())
                .build();

        messagingTemplate.convertAndSendToUser(
                receiverUserId.toString(), "/queue/notifications", receiverNotif);

        log.info("WebSocket notifications sent for txn: {}", txnRef);
    }

    @KafkaListener(topics = "payment-failed", groupId = "notification-service-group")
    public void onPaymentFailed(Map<String, Object> event) {
        String txnRef = event.get("transactionRef").toString();
        String reason = event.get("reason").toString();

        // Broadcast to topic for real-time dashboard update
        messagingTemplate.convertAndSend("/topic/payment-failed", Map.of(
                "transactionRef", txnRef,
                "reason", reason,
                "type", "PAYMENT_FAILED"
        ));

        log.info("Payment failed notification sent: {}", txnRef);
    }

    @KafkaListener(topics = "otp-requested", groupId = "notification-service-group")
    public void onOtpRequested(Map<String, Object> event) {
        String phone = event.get("phone").toString();
        String otp = event.get("otp").toString();
        // In production: integrate SMS gateway (Twilio/MSG91)
        log.info("📱 SMS OTP to {}: {} (integrate SMS gateway here)", phone, otp);
    }

    @Getter @Setter @Builder
    public static class NotificationPayload {
        private String type;
        private String title;
        private String message;
        private String amount;
        private String transactionRef;
        private String timestamp;
    }
}
