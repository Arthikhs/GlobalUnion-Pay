package com.globalunionpay.user.repository;

import com.globalunionpay.user.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    Optional<UserProfile> findByUserId(String userId);

    Optional<UserProfile> findByPhoneNumber(String phoneNumber);

    Optional<UserProfile> findByEmail(String email);

    Optional<UserProfile> findByReferralCode(String referralCode);

    @Query("SELECT u FROM UserProfile u WHERE u.firstName LIKE %:query% OR u.lastName LIKE %:query% OR u.phoneNumber LIKE %:query%")
    List<UserProfile> searchUsers(String query);

    boolean existsByPhoneNumber(String phoneNumber);

    boolean existsByEmail(String email);
}
