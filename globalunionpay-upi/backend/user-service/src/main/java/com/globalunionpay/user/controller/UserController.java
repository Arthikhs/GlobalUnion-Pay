package com.globalunionpay.user.controller;

import com.globalunionpay.user.dto.UserDtos;
import com.globalunionpay.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Service", description = "User profile management APIs")
public class UserController {

    private final UserService userService;

    @GetMapping("/{userId}")
    @Operation(summary = "Get user profile by userId")
    public ResponseEntity<UserDtos.ApiResponse<UserDtos.UserProfileResponse>> getProfile(
            @PathVariable String userId) {
        return ResponseEntity.ok(UserDtos.ApiResponse.success("Profile fetched", userService.getProfile(userId)));
    }

    @PutMapping("/{userId}")
    @Operation(summary = "Update user profile")
    public ResponseEntity<UserDtos.ApiResponse<UserDtos.UserProfileResponse>> updateProfile(
            @PathVariable String userId,
            @RequestBody @Valid UserDtos.UpdateProfileRequest request) {
        return ResponseEntity.ok(UserDtos.ApiResponse.success("Profile updated", userService.updateProfile(userId, request)));
    }

    @PostMapping("/{userId}/kyc")
    @Operation(summary = "Submit KYC documents")
    public ResponseEntity<UserDtos.ApiResponse<UserDtos.UserProfileResponse>> submitKyc(
            @PathVariable String userId,
            @RequestBody @Valid UserDtos.KycSubmitRequest request) {
        return ResponseEntity.ok(UserDtos.ApiResponse.success("KYC submitted successfully", userService.submitKyc(userId, request)));
    }

    @GetMapping("/phone/{phoneNumber}")
    @Operation(summary = "Find user by phone number (for UPI payment)")
    public ResponseEntity<UserDtos.ApiResponse<UserDtos.UserSearchResponse>> findByPhone(
            @PathVariable String phoneNumber) {
        return ResponseEntity.ok(UserDtos.ApiResponse.success("User found", userService.findByPhone(phoneNumber)));
    }

    @GetMapping("/search")
    @Operation(summary = "Search users by name or phone")
    public ResponseEntity<UserDtos.ApiResponse<List<UserDtos.UserSearchResponse>>> searchUsers(
            @RequestParam String query) {
        return ResponseEntity.ok(UserDtos.ApiResponse.success("Search results", userService.searchUsers(query)));
    }

    @PostMapping("/internal/create")
    @Operation(summary = "Internal: Create user profile after registration")
    public ResponseEntity<UserDtos.ApiResponse<UserDtos.UserProfileResponse>> createProfile(
            @RequestParam String userId,
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam String email,
            @RequestParam String phoneNumber) {
        return ResponseEntity.ok(UserDtos.ApiResponse.success("Profile created",
                userService.createProfile(userId, firstName, lastName, email, phoneNumber)));
    }
}
