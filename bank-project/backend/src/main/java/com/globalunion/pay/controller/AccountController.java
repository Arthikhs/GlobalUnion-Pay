package com.globalunion.pay.controller;

import com.globalunion.pay.model.Account;
import com.globalunion.pay.model.Transaction;
import com.globalunion.pay.repository.AccountRepository;
import com.globalunion.pay.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired AccountRepository accountRepo;
    @Autowired TransactionRepository txnRepo;

    @GetMapping
    public List<Account> getAll() {
        return accountRepo.findAll();
    }

    @GetMapping("/by-number/{accNumber}")
    public ResponseEntity<?> getByNumber(@PathVariable String accNumber) {
        return accountRepo.findByAccountNumber(accNumber)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-phone/{phone}")
    public ResponseEntity<?> getByPhone(@PathVariable String phone) {
        return accountRepo.findByPhone(phone)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/check-phone")
    public ResponseEntity<?> checkByPhone(@RequestParam String phone) {
        String digits = phone.replaceAll("[^0-9]", "");
        if (digits.length() == 12) digits = digits.substring(2); // strip 91
        String d = digits;
        return accountRepo.findAll().stream()
            .filter(a -> a.getPhone() != null &&
                a.getPhone().replaceAll("[^0-9]", "").endsWith(d))
            .findFirst()
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Account updated) {
        return accountRepo.findById(id).map(existing -> {
            // check phone uniqueness only if phone changed
            if (!existing.getPhone().equals(updated.getPhone())) {
                if (accountRepo.findByPhone(updated.getPhone()).isPresent()) {
                    return ResponseEntity.badRequest()
                        .body(Map.of("error", "An account with this phone number already exists."));
                }
            }
            existing.setFullName(updated.getFullName());
            existing.setMotherName(updated.getMotherName());
            existing.setFatherName(updated.getFatherName());
            existing.setDob(updated.getDob());
            existing.setPhone(updated.getPhone());
            existing.setEmail(updated.getEmail());
            existing.setAddress(updated.getAddress());
            existing.setOccupation(updated.getOccupation());
            existing.setAccountType(updated.getAccountType());
            return ResponseEntity.ok(accountRepo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        accountRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Account account) {
        if (accountRepo.findByPhone(account.getPhone()).isPresent()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "An account with this phone number already exists."));
        }
        String accNumber = "ACC" + (1000000000L + (long)(Math.random() * 9000000000L));
        String createdOn = LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy"));
        account.setAccountNumber(accNumber);
        account.setCreatedOn(createdOn);
        account.setBalance(account.getInitialDeposit());
        Account saved = accountRepo.save(account);

        Transaction txn = new Transaction();
        txn.setId("TXN" + System.currentTimeMillis());
        txn.setDate(createdOn);
        txn.setDesc("Account Opening — " + account.getFullName());
        txn.setType("credit");
        txn.setAmount(account.getInitialDeposit());
        txn.setAccountNumber(accNumber);
        txn.setAccountHolder(account.getFullName());
        txnRepo.save(txn);

        return ResponseEntity.ok(saved);
    }
}
