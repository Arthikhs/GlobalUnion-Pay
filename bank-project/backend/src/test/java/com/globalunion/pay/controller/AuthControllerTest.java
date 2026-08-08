package com.globalunion.pay.controller;

import com.globalunion.pay.model.Employee;
import com.globalunion.pay.repository.EmployeeRepository;
import com.globalunion.pay.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock EmployeeRepository employeeRepo;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtUtil jwtUtil;
    @InjectMocks AuthController controller;

    private Employee employee;

    @BeforeEach
    void setup() {
        employee = new Employee();
        employee.setEmployeeId("EMP001");
        employee.setPassword("encodedPassword");
        employee.setName("Admin");
        employee.setRole("ROLE_ADMIN");
    }

    @Test
    void login_validCredentials_returns200WithToken() {
        when(employeeRepo.findByEmployeeId("EMP001")).thenReturn(Optional.of(employee));
        when(passwordEncoder.matches("bank@1234", "encodedPassword")).thenReturn(true);
        when(jwtUtil.generateToken("EMP001", "Admin", "ROLE_ADMIN")).thenReturn("mock.jwt.token");

        ResponseEntity<?> response = controller.login(Map.of("employeeId", "EMP001", "password", "bank@1234"));

        assertEquals(200, response.getStatusCode().value());
        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals(true, body.get("success"));
        assertEquals("mock.jwt.token", body.get("token"));
    }

    @Test
    void login_wrongPassword_returns401() {
        when(employeeRepo.findByEmployeeId("EMP001")).thenReturn(Optional.of(employee));
        when(passwordEncoder.matches("wrongpass", "encodedPassword")).thenReturn(false);

        ResponseEntity<?> response = controller.login(Map.of("employeeId", "EMP001", "password", "wrongpass"));

        assertEquals(401, response.getStatusCode().value());
    }

    @Test
    void login_employeeNotFound_returns401() {
        when(employeeRepo.findByEmployeeId("EMP999")).thenReturn(Optional.empty());

        ResponseEntity<?> response = controller.login(Map.of("employeeId", "EMP999", "password", "any"));

        assertEquals(401, response.getStatusCode().value());
    }

    @Test
    void login_validCredentials_tokenGeneratedOnce() {
        when(employeeRepo.findByEmployeeId("EMP001")).thenReturn(Optional.of(employee));
        when(passwordEncoder.matches("bank@1234", "encodedPassword")).thenReturn(true);
        when(jwtUtil.generateToken(any(), any(), any())).thenReturn("mock.jwt.token");

        controller.login(Map.of("employeeId", "EMP001", "password", "bank@1234"));

        verify(jwtUtil, times(1)).generateToken("EMP001", "Admin", "ROLE_ADMIN");
    }
}
