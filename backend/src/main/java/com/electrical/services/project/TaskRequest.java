package com.electrical.services.project;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record TaskRequest(
        @NotBlank @Size(max = 200) String title,
        Long employeeId,
        LocalDate dueDate
) {}