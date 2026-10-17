package com.electrical.services.employee;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record EmployeeRequest(
        @NotBlank @Size(max = 100) String fullName,
        @NotBlank @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit mobile number") String phone,
        @NotBlank @Pattern(regexp = "ENGINEER|SUPERVISOR|ELECTRICIAN|LINEMAN|HELPER|TECHNICIAN|OTHER") String role,
        @NotNull @DecimalMin("0") BigDecimal dailyWage,
        LocalDate joinDate,
        boolean active,
        @Size(max = 500) String notes
) {}