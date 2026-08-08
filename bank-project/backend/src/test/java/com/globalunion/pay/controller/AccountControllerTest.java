package com.globalunion.pay.controller;

import com.globalunion.pay.model.Account;
import com.globalunion.pay.repository.AccountRepository;
import com.globalunion.pay.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountControllerTest {

    @Mock AccountRepository accountRepo;
    @Mock TransactionRepository txnRepo;
    @InjectMocks AccountController controller;

    private Account account;

    @BeforeEach
    void setup() {
        account = new Account();
        account.setId(1L);
        account.setFullName("Test User");
        account.setPhone("9999999999");
        account.setInitialDeposit(5000.0);
        account.setBalance(5000.0);
    }

    @Test
    void create_duplicatePhone_returns400() {
        when(accountRepo.findByPhone("9999999999")).thenReturn(Optional.of(account));

        ResponseEntity<?> response = controller.create(account);

        assertEquals(400, response.getStatusCode().value());
    }

    @Test
    void create_newAccount_returns200() {
        when(accountRepo.findByPhone("9999999999")).thenReturn(Optional.empty());
        when(accountRepo.save(any())).thenReturn(account);
        when(txnRepo.save(any())).thenReturn(null);

        ResponseEntity<?> response = controller.create(account);

        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void delete_callsRepoDeleteById() {
        doNothing().when(accountRepo).deleteById(1L);

        ResponseEntity<?> response = controller.delete(1L);

        assertEquals(200, response.getStatusCode().value());
        verify(accountRepo, times(1)).deleteById(1L);
    }
}
