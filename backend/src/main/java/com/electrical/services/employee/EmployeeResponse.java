package com.electrical.services.employee;

import java.math.BigDecimal;
import java.time.LocalDate;

public record EmployeeResponse(
        Long id, String fullName, String phone, String role,
        BigDecimal dailyWage, LocalDate joinDate, boolean active, String notes) {}