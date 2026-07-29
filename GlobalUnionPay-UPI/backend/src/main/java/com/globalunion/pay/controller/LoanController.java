package com.globalunion.pay.controller;

import com.globalunion.pay.model.Loan;
import com.globalunion.pay.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    @Autowired LoanRepository loanRepo;

    @GetMapping
    public List<Loan> getAll() {
        return loanRepo.findAll();
    }

    @PostMapping
    public Loan create(@RequestBody Loan loan) {
        loan.setIssuedOn(LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy")));
        loan.setStatus("ACTIVE");
        return loanRepo.save(loan);
    }

    @PutMapping("/{id}/close")
    public Loan close(@PathVariable Long id) {
        Loan loan = loanRepo.findById(id).orElseThrow();
        loan.setStatus("CLOSED");
        return loanRepo.save(loan);
    }
}
