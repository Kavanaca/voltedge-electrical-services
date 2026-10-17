package com.electrical.services.invoice;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record InvoiceResponse(
        Long id, String invoiceNumber, Long quotationId, String quotationNumber,
        String customerName, String customerPhone, String customerEmail,
        String location, String service,
        BigDecimal subtotal, BigDecimal discount, BigDecimal gstPercent,
        BigDecimal gstAmount, BigDecimal total, BigDecimal paid, BigDecimal balance,
        String paymentStatus, LocalDate dueDate, String notes, LocalDateTime createdAt,
        List<InvoiceItemResponse> items, List<PaymentResponse> payments) {}