package com.electrical.services.document;

import java.time.LocalDate;

public record DocumentResponse(
        Long id, String docType, String title, String issuingAuthority, String documentNumber,
        LocalDate issueDate, LocalDate expiryDate, String notes,
        boolean hasFile, String fileName, Long fileSize,
        String expiryStatus, Long daysLeft) {}