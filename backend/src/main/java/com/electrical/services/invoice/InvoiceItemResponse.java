package com.electrical.services.invoice;

import java.math.BigDecimal;

public record InvoiceItemResponse(
        Long id, String itemType, String description,
        BigDecimal quantity, String unit, BigDecimal unitPrice, BigDecimal amount) {}