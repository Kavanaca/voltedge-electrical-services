package com.electrical.services.project;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ProjectSummary(
        Long id, String projectNumber, String name, String customerName,
        String status, int progress, LocalDate endDate, BigDecimal budget) {}