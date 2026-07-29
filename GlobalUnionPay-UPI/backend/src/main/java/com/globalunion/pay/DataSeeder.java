package com.globalunion.pay;

import com.globalunion.pay.model.Employee;
import com.globalunion.pay.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired EmployeeRepository employeeRepo;
    @Autowired PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (employeeRepo.findByEmployeeId("EMP001").isEmpty()) {
            Employee emp = new Employee();
            emp.setEmployeeId("EMP001");
            emp.setName("Arthika");
            emp.setPassword(passwordEncoder.encode("bank@1234"));
            emp.setRole("EMPLOYEE");
            employeeRepo.save(emp);
        }
    }
}
