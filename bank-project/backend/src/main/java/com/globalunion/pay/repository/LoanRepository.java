package com.globalunion.pay.repository;

import com.globalunion.pay.model.Loan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanRepository extends JpaRepository<Loan, Long> {}
