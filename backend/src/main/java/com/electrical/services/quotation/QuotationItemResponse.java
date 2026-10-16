package com.electrical.services.quotation;

import java.math.BigDecimal;

public record QuotationItemResponse(
        Long id, String itemType, String description,
        BigDecimal quantity, String unit, BigDecimal unitPrice, BigDecimal amount) {}