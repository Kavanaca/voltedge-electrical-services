package com.electrical.services.solar;

import java.math.BigDecimal;
import java.time.LocalDate;

public record SolarResponse(
        Long id, Long projectId, String customerName, String customerPhone, String siteAddress,
        String systemType, BigDecimal capacityKw, String panelBrand, Integer panelCount,
        Integer panelWatt, String inverterBrand, BigDecimal inverterKw, String status,
        LocalDate surveyDate, LocalDate installDate, LocalDate commissioningDate,
        Integer warrantyYears, String notes) {}