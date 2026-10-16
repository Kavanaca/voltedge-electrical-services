package com.electrical.services.quotation;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;

public record QuotationRequest(
        Long enquiryId,
        @NotBlank @Size(max = 100) String customerName,
        @NotBlank @Size(max = 15) String customerPhone,
        @Email @Size(max = 150) String customerEmail,
        @NotBlank @Size(max = 200) String location,
        @NotBlank @Size(max = 100) String service,
        @NotNull @DecimalMin("0") @DecimalMax("100") BigDecimal gstPercent,
        @NotNull @DecimalMin("0") BigDecimal discount,
        @Min(1) @Max(365) Integer validDays,
        @Size(max = 3000) String terms,
        @NotEmpty @Valid List<QuotationItemRequest> items
) {}