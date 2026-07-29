package com.globalunionpay.merchant.service;

import com.globalunionpay.merchant.dto.MerchantDtos;
import com.globalunionpay.merchant.model.Merchant;
import com.globalunionpay.merchant.repository.MerchantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MerchantService {

    private final MerchantRepository merchantRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public MerchantDtos.MerchantResponse registerMerchant(MerchantDtos.RegisterMerchantRequest request) {
        if (merchantRepository.existsByUserId(request.getUserId())) {
            throw new RuntimeException("Merchant already registered for user: " + request.getUserId());
        }

        String merchantId = "MER" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
        String upiId = merchantId.toLowerCase() + "@gupay";

        Merchant merchant = Merchant.builder()
                .merchantId(merchantId)
                .userId(request.getUserId())
                .businessName(request.getBusinessName())
                .businessType(request.getBusinessType())
                .businessCategory(request.getBusinessCategory())
                .gstin(request.getGstin())
                .pan(request.getPan())
                .merchantUpiId(upiId)
                .supportEmail(request.getSupportEmail())
                .supportPhone(request.getSupportPhone())
                .bankAccountNumber(request.getBankAccountNumber())
                .bankIfscCode(request.getBankIfscCode())
                .bankAccountName(request.getBankAccountName())
                .totalRevenue(BigDecimal.ZERO)
                .pendingSettlement(BigDecimal.ZERO)
                .settledAmount(BigDecimal.ZERO)
                .build();

        Merchant saved = merchantRepository.save(merchant);
        kafkaTemplate.send("merchant-registered", merchantId, "Merchant registered: " + merchantId);
        log.info("Merchant registered: {}", merchantId);
        return mapToResponse(saved);
    }

    public MerchantDtos.MerchantResponse getMerchant(String merchantId) {
        Merchant merchant = merchantRepository.findByMerchantId(merchantId)
                .orElseThrow(() -> new RuntimeException("Merchant not found: " + merchantId));
        return mapToResponse(merchant);
    }

    public MerchantDtos.MerchantResponse getMerchantByUserId(String userId) {
        Merchant merchant = merchantRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Merchant not found for user: " + userId));
        return mapToResponse(merchant);
    }

    public MerchantDtos.MerchantResponse approveMerchant(String merchantId) {
        Merchant merchant = merchantRepository.findByMerchantId(merchantId)
                .orElseThrow(() -> new RuntimeException("Merchant not found: " + merchantId));
        merchant.setStatus(Merchant.MerchantStatus.ACTIVE);
        return mapToResponse(merchantRepository.save(merchant));
    }

    private MerchantDtos.MerchantResponse mapToResponse(Merchant m) {
        return MerchantDtos.MerchantResponse.builder()
                .merchantId(m.getMerchantId())
                .userId(m.getUserId())
                .businessName(m.getBusinessName())
                .businessType(m.getBusinessType())
                .businessCategory(m.getBusinessCategory())
                .merchantUpiId(m.getMerchantUpiId())
                .logoUrl(m.getLogoUrl())
                .status(m.getStatus())
                .totalRevenue(m.getTotalRevenue())
                .pendingSettlement(m.getPendingSettlement())
                .settledAmount(m.getSettledAmount())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
