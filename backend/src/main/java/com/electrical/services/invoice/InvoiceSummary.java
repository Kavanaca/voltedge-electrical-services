package com.electrical.services.invoice;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record InvoiceSummary(
        Long id, String invoiceNumber, Long quotationId, String customerName,
        BigDecimal total, BigDecimal paid, BigDecimal balance,
        String paymentStatus, LocalDate dueDate, LocalDateTime createdAt) {}