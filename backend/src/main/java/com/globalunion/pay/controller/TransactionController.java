package com.globalunion.pay.controller;

import com.globalunion.pay.model.Transaction;
import com.globalunion.pay.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired TransactionRepository txnRepo;

    @GetMapping
    public List<Transaction> getAll() {
        return txnRepo.findAll();
    }

    @PostMapping("/deposit")
    public Transaction deposit(@RequestBody Map<String, Object> body) {
        Transaction txn = new Transaction();
        txn.setId("TXN" + System.currentTimeMillis());
        txn.setDate(LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy")));
        txn.setDesc(body.getOrDefault("note", "Cash Deposit").toString());
        txn.setType("credit");
        txn.setAmount(Double.parseDouble(body.get("amount").toString()));
        txn.setAccountNumber(body.get("accountNumber").toString());
        txn.setAccountHolder(body.get("accountHolder").toString());
        return txnRepo.save(txn);
    }
}
