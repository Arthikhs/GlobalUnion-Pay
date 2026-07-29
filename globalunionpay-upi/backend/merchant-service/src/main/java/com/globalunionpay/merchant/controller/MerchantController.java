package com.globalunionpay.merchant.controller;

import com.globalunionpay.merchant.dto.MerchantDtos;
import com.globalunionpay.merchant.service.MerchantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/merchants")
@RequiredArgsConstructor
@Tag(name = "Merchant Service", description = "Merchant management APIs")
public class MerchantController {

    private final MerchantService merchantService;

    @PostMapping("/register")
    @Operation(summary = "Register a new merchant")
    public ResponseEntity<MerchantDtos.ApiResponse<MerchantDtos.MerchantResponse>> register(
            @RequestBody @Valid MerchantDtos.RegisterMerchantRequest request) {
        return ResponseEntity.ok(MerchantDtos.ApiResponse.success("Merchant registered",
                merchantService.registerMerchant(request)));
    }

    @GetMapping("/{merchantId}")
    @Operation(summary = "Get merchant by merchantId")
    public ResponseEntity<MerchantDtos.ApiResponse<MerchantDtos.MerchantResponse>> getMerchant(
            @PathVariable String merchantId) {
        return ResponseEntity.ok(MerchantDtos.ApiResponse.success("Merchant found",
                merchantService.getMerchant(merchantId)));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get merchant by userId")
    public ResponseEntity<MerchantDtos.ApiResponse<MerchantDtos.MerchantResponse>> getMerchantByUser(
            @PathVariable String userId) {
        return ResponseEntity.ok(MerchantDtos.ApiResponse.success("Merchant found",
                merchantService.getMerchantByUserId(userId)));
    }

    @PutMapping("/{merchantId}/approve")
    @Operation(summary = "Approve merchant (Admin)")
    public ResponseEntity<MerchantDtos.ApiResponse<MerchantDtos.MerchantResponse>> approve(
            @PathVariable String merchantId) {
        return ResponseEntity.ok(MerchantDtos.ApiResponse.success("Merchant approved",
                merchantService.approveMerchant(merchantId)));
    }
}
