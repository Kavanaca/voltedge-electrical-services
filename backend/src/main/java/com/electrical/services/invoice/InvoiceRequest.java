package com.electrical.services.invoice;

import jakarta.validation.constraints.*;

public record InvoiceRequest(
        @NotNull Long quotationId,
        @Min(0) @Max(365) Integer dueDays,
        @Size(max = 2000) String notes
) {}