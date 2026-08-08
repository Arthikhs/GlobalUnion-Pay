package com.globalunion.pay.controller;

import com.globalunion.pay.model.Account;
import com.globalunion.pay.model.Transaction;
import com.globalunion.pay.repository.AccountRepository;
import com.globalunion.pay.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionControllerTest {

    @Mock AccountRepository accountRepo;
    @Mock TransactionRepository txnRepo;
    @InjectMocks TransactionController controller;

    private Account account;

    @BeforeEach
    void setup() {
        account = new Account();
        account.setAccountNumber("ACC123");
        account.setFullName("Test User");
        account.setBalance(10000.0);
    }

    @Test
    void deposit_accountNotFound_returns400() {
        when(accountRepo.findByAccountNumber("ACC999")).thenReturn(Optional.empty());

        ResponseEntity<?> response = controller.deposit(
            Map.of("accountNumber", "ACC999", "amount", "500", "accountHolder", "Test")
        );

        assertEquals(400, response.getStatusCode().value());
    }

    @Test
    void deposit_valid_balanceIncreases() {
        when(accountRepo.findByAccountNumber("ACC123")).thenReturn(Optional.of(account));
        when(accountRepo.save(any())).thenReturn(account);
        Transaction txn = new Transaction();
        txn.setAmount(2000.0);
        when(txnRepo.save(any())).thenReturn(txn);

        controller.deposit(Map.of("accountNumber", "ACC123", "amount", "2000", "accountHolder", "Test User"));

        assertEquals(12000.0, account.getBalance());
    }

    @Test
    void withdraw_insufficientBalance_returns400() {
        when(accountRepo.findByAccountNumber("ACC123")).thenReturn(Optional.of(account));

        ResponseEntity<?> response = controller.withdraw(
            Map.of("accountNumber", "ACC123", "amount", "99999", "accountHolder", "Test User")
        );

        assertEquals(400, response.getStatusCode().value());
    }

    @Test
    void transfer_senderNotFound_returns400() {
        when(accountRepo.findByAccountNumber("ACC_GHOST")).thenReturn(Optional.empty());

        ResponseEntity<?> response = controller.transfer(
            Map.of("fromAccount", "ACC_GHOST", "toAccount", "ACC123", "amount", "500")
        );

        assertEquals(400, response.getStatusCode().value());
    }
}
