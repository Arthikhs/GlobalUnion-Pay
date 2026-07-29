package com.globalunionpay.merchant.repository;

import com.globalunionpay.merchant.model.Merchant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MerchantRepository extends JpaRepository<Merchant, Long> {
    Optional<Merchant> findByMerchantId(String merchantId);
    Optional<Merchant> findByUserId(String userId);
    Optional<Merchant> findByMerchantUpiId(String merchantUpiId);
    List<Merchant> findByStatus(Merchant.MerchantStatus status);
    boolean existsByUserId(String userId);
}
