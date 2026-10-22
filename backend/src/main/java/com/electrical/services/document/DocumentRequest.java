package com.electrical.services.document;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record DocumentRequest(
        @NotBlank @Pattern(regexp = "LICENCE|CERTIFICATE|PROJECT_APPROVAL|INSURANCE|OTHER") String docType,
        @NotBlank @Size(max = 150) String title,
        @Size(max = 150) String issuingAuthority,
        @Size(max = 100) String documentNumber,
        LocalDate issueDate,
        LocalDate expiryDate,
        @Size(max = 1000) String notes
) {}