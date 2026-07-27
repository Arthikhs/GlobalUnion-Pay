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
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired TransactionRepository txnRepo;
    @Autowired AccountRepository accountRepo;

    @GetMapping
    public List<Transaction> getAll() {
        return txnRepo.findAll();
    }

    @GetMapping("/account/{accNumber}")
    public List<Transaction> getByAccount(@PathVariable String accNumber) {
        return txnRepo.findByAccountNumber(accNumber);
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestBody Map<String, Object> body) {
        String fromAcc = body.get("fromAccount").toString();
        String toAcc = body.get("toAccount").toString();
        double amount = Double.parseDouble(body.get("amount").toString());
        String note = body.getOrDefault("note", "UPI Transfer").toString();

        Account sender = accountRepo.findByAccountNumber(fromAcc).orElse(null);
        Account receiver = accountRepo.findByAccountNumber(toAcc).orElse(null);
        if (sender == null) return ResponseEntity.badRequest().body(Map.of("error", "Sender account not found."));
        if (receiver == null) return ResponseEntity.badRequest().body(Map.of("error", "Receiver account not found."));

        double senderBal = sender.getBalance() != null ? sender.getBalance() : 0;
        if (amount > senderBal) return ResponseEntity.badRequest().body(Map.of("error", "Insufficient balance."));

        String date = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy"));
        String txnId = "TXN" + System.currentTimeMillis();

        sender.setBalance(senderBal - amount);
        accountRepo.save(sender);
        receiver.setBalance((receiver.getBalance() != null ? receiver.getBalance() : 0) + amount);
        accountRepo.save(receiver);

        Transaction debit = new Transaction();
        debit.setId(txnId + "D");
        debit.setDate(date);
        debit.setDesc(note + " → " + receiver.getFullName());
        debit.setType("debit");
        debit.setAmount(amount);
        debit.setAccountNumber(fromAcc);
        debit.setAccountHolder(sender.getFullName());
        txnRepo.save(debit);

        Transaction credit = new Transaction();
        credit.setId(txnId + "C");
        credit.setDate(date);
        credit.setDesc(note + " ← " + sender.getFullName());
        credit.setType("credit");
        credit.setAmount(amount);
        credit.setAccountNumber(toAcc);
        credit.setAccountHolder(receiver.getFullName());
        txnRepo.save(credit);

        return ResponseEntity.ok(Map.of("id", txnId, "status", "SUCCESS", "amount", amount));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        txnRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@RequestBody Map<String, Object> body) {
        String accNumber = body.get("accountNumber").toString();
        Account account = accountRepo.findByAccountNumber(accNumber).orElse(null);
        if (account == null) return ResponseEntity.badRequest().body(Map.of("error", "Account not found."));

        double amount = Double.parseDouble(body.get("amount").toString());
        String note = body.getOrDefault("note", "").toString().trim();

        account.setBalance((account.getBalance() != null ? account.getBalance() : 0) + amount);
        accountRepo.save(account);

        Transaction txn = new Transaction();
        txn.setId("TXN" + System.currentTimeMillis());
        txn.setDate(LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy")));
        txn.setDesc(note.isEmpty() ? "Cash Deposit" : note);
        txn.setType("credit");
        txn.setAmount(amount);
        txn.setAccountNumber(accNumber);
        txn.setAccountHolder(body.get("accountHolder").toString());
        return ResponseEntity.ok(txnRepo.save(txn));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestBody Map<String, Object> body) {
        String accNumber = body.get("accountNumber").toString();
        Account account = accountRepo.findByAccountNumber(accNumber).orElse(null);
        if (account == null) return ResponseEntity.badRequest().body(Map.of("error", "Account not found."));

        double amount = Double.parseDouble(body.get("amount").toString());

        // Calculate real balance from all transactions if balance is null
        double currentBalance;
        if (account.getBalance() == null) {
            double credits = txnRepo.findByAccountNumber(accNumber).stream()
                .filter(t -> "credit".equals(t.getType())).mapToDouble(t -> t.getAmount()).sum();
            double debits = txnRepo.findByAccountNumber(accNumber).stream()
                .filter(t -> "debit".equals(t.getType())).mapToDouble(t -> t.getAmount()).sum();
            currentBalance = credits - debits;
            account.setBalance(currentBalance);
        } else {
            currentBalance = account.getBalance();
        }

        if (amount > currentBalance)
            return ResponseEntity.badRequest().body(Map.of("error", "Insufficient balance. Available: \u20b9" + String.format("%.2f", currentBalance)));

        String note = body.getOrDefault("note", "").toString().trim();
        account.setBalance(currentBalance - amount);
        accountRepo.save(account);

        Transaction txn = new Transaction();
        txn.setId("TXN" + System.currentTimeMillis());
        txn.setDate(LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy")));
        txn.setDesc(note.isEmpty() ? "Cash Withdrawal" : note);
        txn.setType("debit");
        txn.setAmount(amount);
        txn.setAccountNumber(accNumber);
        txn.setAccountHolder(body.get("accountHolder").toString());
        return ResponseEntity.ok(txnRepo.save(txn));
    }
}
