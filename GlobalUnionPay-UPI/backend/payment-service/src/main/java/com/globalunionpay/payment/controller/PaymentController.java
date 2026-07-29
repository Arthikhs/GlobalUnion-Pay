package com.globalunionpay.payment.controller;

import com.globalunionpay.payment.dto.PaymentDtos;
import com.globalunionpay.payment.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Tag(name = "Payment Service", description = "Payment processing APIs")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/initiate")
    @Operation(summary = "Initiate a UPI payment")
    public ResponseEntity<PaymentDtos.ApiResponse<PaymentDtos.PaymentResponse>> initiatePayment(
            @RequestBody @Valid PaymentDtos.InitiatePaymentRequest request) {
        return ResponseEntity.ok(PaymentDtos.ApiResponse.success("Payment initiated",
                paymentService.initiatePayment(request)));
    }

    @PostMapping("/confirm")
    @Operation(summary = "Confirm payment with UPI PIN")
    public ResponseEntity<PaymentDtos.ApiResponse<PaymentDtos.PaymentResponse>> confirmPayment(
            @RequestBody @Valid PaymentDtos.ConfirmPaymentRequest request) {
        return ResponseEntity.ok(PaymentDtos.ApiResponse.success("Payment processed",
                paymentService.confirmPayment(request)));
    }

    @PostMapping("/schedule")
    @Operation(summary = "Schedule a future payment")
    public ResponseEntity<PaymentDtos.ApiResponse<PaymentDtos.PaymentResponse>> schedulePayment(
            @RequestBody @Valid PaymentDtos.SchedulePaymentRequest request) {
        return ResponseEntity.ok(PaymentDtos.ApiResponse.success("Payment scheduled",
                paymentService.schedulePayment(request)));
    }

    @GetMapping("/{paymentId}")
    @Operation(summary = "Get payment details")
    public ResponseEntity<PaymentDtos.ApiResponse<PaymentDtos.PaymentResponse>> getPayment(
            @PathVariable String paymentId) {
        return ResponseEntity.ok(PaymentDtos.ApiResponse.success("Payment details",
                paymentService.getPayment(paymentId)));
    }

    @GetMapping("/history/{userId}")
    @Operation(summary = "Get payment history for a user")
    public ResponseEntity<PaymentDtos.ApiResponse<Page<PaymentDtos.PaymentResponse>>> getHistory(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(PaymentDtos.ApiResponse.success("Payment history",
                paymentService.getPaymentHistory(userId, PageRequest.of(page, size))));
    }
}
