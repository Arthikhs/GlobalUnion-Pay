package com.globalunionpay.wallet.controller;

import com.globalunionpay.wallet.service.WalletService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/wallets")
@RequiredArgsConstructor
@Tag(name = "Wallet Service", description = "Wallet balance management APIs")
public class WalletController {

    private final WalletService walletService;

    @GetMapping("/{userId}/balance")
    @Operation(summary = "Get wallet balance — auto creates wallet if not exists")
    public ResponseEntity<Map<String, Object>> getBalance(@PathVariable String userId) {
        BigDecimal balance = walletService.getOrCreateBalance(userId);
        return ResponseEntity.ok(Map.of("success", true, "userId", userId, "balance", balance, "currency", "INR"));
    }

    @PostMapping("/{userId}/add-money")
    @Operation(summary = "Add money to wallet")
    public ResponseEntity<Map<String, Object>> addMoney(
            @PathVariable String userId,
            @RequestParam BigDecimal amount) {
        walletService.addMoney(userId, amount);
        return ResponseEntity.ok(Map.of("success", true, "message", "Money added successfully", "amount", amount));
    }

    @PostMapping("/{userId}/deduct")
    @Operation(summary = "Deduct money from wallet (internal)")
    public ResponseEntity<Map<String, Object>> deductMoney(
            @PathVariable String userId,
            @RequestParam BigDecimal amount) {
        boolean success = walletService.deductMoney(userId, amount);
        return ResponseEntity.ok(Map.of("success", success,
                "message", success ? "Deducted successfully" : "Insufficient balance"));
    }

    @PostMapping("/transfer")
    @Operation(summary = "Transfer money between two wallets")
    public ResponseEntity<Map<String, Object>> transfer(
            @RequestParam String senderUserId,
            @RequestParam String receiverPhone,
            @RequestParam BigDecimal amount) {
        Map<String, Object> result = walletService.transfer(senderUserId, receiverPhone, amount);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/create/{userId}")
    @Operation(summary = "Create wallet for new user")
    public ResponseEntity<Map<String, Object>> createWallet(@PathVariable String userId) {
        walletService.createWallet(userId);
        return ResponseEntity.ok(Map.of("success", true, "message", "Wallet created"));
    }
}
