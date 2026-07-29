package com.globalunionpay.transaction.controller;

import com.globalunionpay.transaction.model.Transaction;
import com.globalunionpay.transaction.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
@Tag(name = "Transaction Service", description = "Transaction history and analytics APIs")
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping("/{userId}")
    @Operation(summary = "Get transaction history")
    public ResponseEntity<Map<String, Object>> getTransactions(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<Transaction> transactions = transactionService.getTransactions(userId, PageRequest.of(page, size));
        return ResponseEntity.ok(Map.of("success", true, "data", transactions));
    }

    @GetMapping("/{userId}/stats")
    @Operation(summary = "Get monthly spending stats")
    public ResponseEntity<Map<String, Object>> getMonthlyStats(@PathVariable String userId) {
        return ResponseEntity.ok(Map.of("success", true, "data", transactionService.getMonthlyStats(userId)));
    }

    @GetMapping("/detail/{transactionId}")
    @Operation(summary = "Get single transaction detail")
    public ResponseEntity<Map<String, Object>> getTransaction(@PathVariable String transactionId) {
        return ResponseEntity.ok(Map.of("success", true, "data", transactionService.getTransaction(transactionId)));
    }
}
