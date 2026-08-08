package com.globalunion.pay.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setup() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", "ThisIsAVeryLongSecretKeyForTestingPurposes1234567890");
        ReflectionTestUtils.setField(jwtUtil, "expiration", 3600000L);
    }

    @Test
    void generateToken_notNull() {
        String token = jwtUtil.generateToken("EMP001", "Admin", "ROLE_ADMIN");
        assertNotNull(token);
    }

    @Test
    void isValid_validToken_returnsTrue() {
        String token = jwtUtil.generateToken("EMP001", "Admin", "ROLE_ADMIN");
        assertTrue(jwtUtil.isValid(token));
    }

    @Test
    void isValid_garbageToken_returnsFalse() {
        assertFalse(jwtUtil.isValid("fake.invalid.token"));
    }

    @Test
    void extractEmployeeId_returnsCorrectSubject() {
        String token = jwtUtil.generateToken("EMP001", "Admin", "ROLE_ADMIN");
        assertEquals("EMP001", jwtUtil.extractEmployeeId(token));
    }
}
