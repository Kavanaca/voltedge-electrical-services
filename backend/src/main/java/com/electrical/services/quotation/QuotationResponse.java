package com.electrical.services.quotation;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record QuotationResponse(
        Long id, String quotationNumber, Long enquiryId,
        String customerName, String customerPhone, String customerEmail,
        String location, String service, String status,
        BigDecimal subtotal, BigDecimal discount, BigDecimal gstPercent,
        BigDecimal gstAmount, BigDecimal total, LocalDate validUntil,
        String terms, LocalDateTime createdAt, List<QuotationItemResponse> items) {}