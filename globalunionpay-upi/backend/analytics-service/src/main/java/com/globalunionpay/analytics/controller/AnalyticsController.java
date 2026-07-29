package com.globalunionpay.analytics.controller;

import com.globalunionpay.analytics.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics Service", description = "Analytics and reporting APIs")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get global dashboard stats (Admin)")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        return ResponseEntity.ok(Map.of("success", true, "data", analyticsService.getDashboardStats()));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get analytics for a specific user")
    public ResponseEntity<Map<String, Object>> getUserAnalytics(@PathVariable String userId) {
        return ResponseEntity.ok(Map.of("success", true, "data", analyticsService.getUserAnalytics(userId)));
    }
}
