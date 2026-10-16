package com.electrical.services.quotation;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record QuotationItemRequest(
        @NotBlank @Pattern(regexp = "LABOUR|MATERIAL|SERVICE") String itemType,
        @NotBlank @Size(max = 300) String description,
        @NotNull @DecimalMin("0.01") BigDecimal quantity,
        @Size(max = 20) String unit,
        @NotNull @DecimalMin("0.00") BigDecimal unitPrice
) {}