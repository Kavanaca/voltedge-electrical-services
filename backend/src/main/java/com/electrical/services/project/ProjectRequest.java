package com.electrical.services.project;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record ProjectRequest(
        @NotNull Long quotationId,
        @NotBlank @Size(max = 150) String name,
        LocalDate startDate,
        LocalDate endDate,
        @Size(max = 150) String contractorName,
        @Size(max = 2000) String notes
) {}