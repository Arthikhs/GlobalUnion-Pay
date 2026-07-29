package com.globalunion.pay.repository;

import com.globalunion.pay.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, String> {
    List<Transaction> findByAccountNumber(String accountNumber);
}
