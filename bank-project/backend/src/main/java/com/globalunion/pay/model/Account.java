package com.globalunion.pay.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String accountNumber;
    private String fullName;
    private String motherName;
    private String fatherName;
    private String dob;
    private String phone;
    private String email;
    @Column(length = 500)
    private String address;
    private String occupation;
    private String accountType;
    private Double initialDeposit;
    private Double balance;
    private String createdOn;
    private String profilePicture;
}
