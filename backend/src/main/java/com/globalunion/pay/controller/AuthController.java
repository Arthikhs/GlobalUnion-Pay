package com.globalunion.pay.controller;

import com.globalunion.pay.model.Employee;
import com.globalunion.pay.repository.EmployeeRepository;
import com.globalunion.pay.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired EmployeeRepository employeeRepo;
    @Autowired PasswordEncoder passwordEncoder;
    @Autowired JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String empId = body.get("employeeId");
        String password = body.get("password");

        Optional<Employee> empOpt = employeeRepo.findByEmployeeId(empId);
        if (empOpt.isPresent() && passwordEncoder.matches(password, empOpt.get().getPassword())) {
            Employee emp = empOpt.get();
            String token = jwtUtil.generateToken(emp.getEmployeeId(), emp.getName(), emp.getRole());
            return ResponseEntity.ok(Map.of(
                "success", true,
                "token", token,
                "employeeId", emp.getEmployeeId(),
                "name", emp.getName()
            ));
        }
        return ResponseEntity.status(401).body(Map.of("success", false, "message", "Invalid Employee ID or Password."));
    }
}
