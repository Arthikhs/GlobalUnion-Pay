package com.globalunionpay.upi.controller;

import com.globalunionpay.upi.dto.UpiDtos.*;
import com.globalunionpay.upi.service.UpiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/upi")
@RequiredArgsConstructor
@Tag(name = "UPI", description = "UPI ID management and payments")
public class UpiController {

    private final UpiService upiService;

    @PostMapping("/create")
    @Operation(summary = "Create UPI ID for user")
    public ResponseEntity<UpiIdResponse> createUpiId(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Phone") String phone,
            @RequestHeader("X-User-Name") String fullName,
            @Valid @RequestBody CreateUpiRequest request) {
        return ResponseEntity.ok(upiService.createUpiId(userId, phone, fullName, request));
    }

    @GetMapping("/validate/{upiId}")
    @Operation(summary = "Validate UPI ID — shows name before payment like PhonePe")
    public ResponseEntity<UpiValidationResponse> validateUpiId(@PathVariable String upiId) {
        return ResponseEntity.ok(upiService.validateUpiId(upiId));
    }

    @GetMapping("/validate/phone/{phone}")
    @Operation(summary = "Validate by phone number")
    public ResponseEntity<UpiValidationResponse> validateByPhone(@PathVariable String phone) {
        return ResponseEntity.ok(upiService.validateByPhone(phone));
    }

    @PostMapping("/pay")
    @Operation(summary = "Initiate UPI payment — PhonePe style")
    public ResponseEntity<PaymentResponse> initiatePayment(@Valid @RequestBody InitiatePaymentRequest request) {
        return ResponseEntity.ok(upiService.initiatePayment(request));
    }

    @GetMapping("/my-upi-ids")
    @Operation(summary = "Get all UPI IDs of logged-in user")
    public ResponseEntity<List<UpiIdResponse>> getMyUpiIds(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(upiService.getUserUpiIds(userId));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "upi-service"));
    }
}
