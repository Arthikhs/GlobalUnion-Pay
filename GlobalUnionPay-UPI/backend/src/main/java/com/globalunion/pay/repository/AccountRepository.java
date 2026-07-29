package com.globalunion.pay.repository;

import com.globalunion.pay.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByPhone(String phone);
    Optional<Account> findByAccountNumber(String accountNumber);
}
