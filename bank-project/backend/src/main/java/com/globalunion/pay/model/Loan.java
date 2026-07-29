package com.globalunion.pay.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "loans")
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String accountNumber;
    private String accountHolder;
    private String loanType;
    private String purpose;
    private Double loanAmount;
    private Double interestRate;
    private Integer tenureMonths;
    private String status;
    private String issuedOn;
}
