package com.globalunionpay.upi.repository;

import com.globalunionpay.upi.model.UpiId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UpiIdRepository extends JpaRepository<UpiId, Long> {
    Optional<UpiId> findByUpiId(String upiId);
    List<UpiId> findByUserId(Long userId);
    Optional<UpiId> findByUserIdAndPrimaryTrue(Long userId);
    boolean existsByUpiId(String upiId);
    Optional<UpiId> findByPhone(String phone);
}
