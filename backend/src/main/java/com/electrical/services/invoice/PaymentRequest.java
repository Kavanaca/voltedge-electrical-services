package com.electrical.services.invoice;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record PaymentRequest(
        @NotNull @DecimalMin("0.01") BigDecimal amount,
        @NotBlank @Pattern(regexp = "CASH|UPI|BANK_TRANSFER|CHEQUE") String method,
        LocalDate paymentDate,
        @Size(max = 100) String reference
) {}