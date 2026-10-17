package com.electrical.services.project;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record ProjectResponse(
        Long id, String projectNumber, Long quotationId, String quotationNumber,
        String name, String customerName, String customerPhone, String location,
        String service, String status, LocalDate startDate, LocalDate endDate,
        String contractorName, BigDecimal budget, String notes, LocalDateTime createdAt,
        int progress, List<TaskResponse> tasks) {}