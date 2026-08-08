package com.globalunion.pay.controller;

import com.globalunion.pay.model.Loan;
import com.globalunion.pay.repository.LoanRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoanControllerTest {

    @Mock LoanRepository loanRepo;
    @InjectMocks LoanController controller;

    private Loan loan;

    @BeforeEach
    void setup() {
        loan = new Loan();
        loan.setId(1L);
        loan.setAccountNumber("ACC123");
        loan.setAccountHolder("Test User");
        loan.setLoanType("Education");
        loan.setLoanAmount(100000.0);
        loan.setInterestRate(8.5);
        loan.setTenureMonths(24);
    }

    @Test
    void getAll_returnsLoanList() {
        when(loanRepo.findAll()).thenReturn(List.of(loan));

        List<Loan> result = controller.getAll();

        assertEquals(1, result.size());
        assertEquals("Education", result.get(0).getLoanType());
    }

    @Test
    void create_setsStatusActiveAndIssuedOn() {
        when(loanRepo.save(any())).thenAnswer(i -> i.getArgument(0));

        Loan result = controller.create(loan);

        assertEquals("ACTIVE", result.getStatus());
        assertNotNull(result.getIssuedOn());
    }

    @Test
    void create_savesLoanToRepo() {
        when(loanRepo.save(any())).thenReturn(loan);

        controller.create(loan);

        verify(loanRepo, times(1)).save(any());
    }

    @Test
    void close_setsStatusClosed() {
        loan.setStatus("ACTIVE");
        when(loanRepo.findById(1L)).thenReturn(Optional.of(loan));
        when(loanRepo.save(any())).thenAnswer(i -> i.getArgument(0));

        Loan result = controller.close(1L);

        assertEquals("CLOSED", result.getStatus());
    }

    @Test
    void close_loanNotFound_throwsException() {
        when(loanRepo.findById(99L)).thenReturn(Optional.empty());

        assertThrows(Exception.class, () -> controller.close(99L));
    }
}
