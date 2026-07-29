package com.globalunion.pay.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "transactions")
public class Transaction {
    @Id
    private String id;
    private String date;
    private String desc;
    private String type;
    private Double amount;
    private String accountNumber;
    private String accountHolder;
}
