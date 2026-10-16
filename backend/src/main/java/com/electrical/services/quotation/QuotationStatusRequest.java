package com.electrical.services.quotation;

import jakarta.validation.constraints.NotBlank;

public record QuotationStatusRequest(@NotBlank String status) {}