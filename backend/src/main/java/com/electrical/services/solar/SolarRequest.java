package com.electrical.services.solar;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record SolarRequest(
        Long projectId,
        @NotBlank @Size(max = 100) String customerName,
        @NotBlank @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit mobile number") String customerPhone,
        @NotBlank @Size(max = 300) String siteAddress,
        @NotBlank @Pattern(regexp = "ON_GRID|OFF_GRID|HYBRID") String systemType,
        @NotNull @DecimalMin("0.1") @DecimalMax("100000") BigDecimal capacityKw,
        @Size(max = 100) String panelBrand,
        @Min(0) @Max(100000) Integer panelCount,
        @Min(0) @Max(2000) Integer panelWatt,
        @Size(max = 100) String inverterBrand,
        @DecimalMin("0") @DecimalMax("100000") BigDecimal inverterKw,
        @NotBlank @Pattern(regexp = "SURVEY|DESIGN|APPROVAL_PENDING|MATERIAL_ORDERED|INSTALLING|COMMISSIONED|CANCELLED") String status,
        LocalDate surveyDate,
        LocalDate installDate,
        LocalDate commissioningDate,
        @Min(0) @Max(50) Integer warrantyYears,
        @Size(max = 2000) String notes
) {}