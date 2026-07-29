package com.globalunion.pay.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "employees")
public class Employee {
    @Id
    private String employeeId;
    private String password;
    private String name;
    private String role;
}
