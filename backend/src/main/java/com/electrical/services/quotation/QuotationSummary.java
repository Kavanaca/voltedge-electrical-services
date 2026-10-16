package com.electrical.services.quotation;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record QuotationSummary(
        Long id, String quotationNumber, String customerName, String service,
        String status, BigDecimal total, LocalDateTime createdAt) {}