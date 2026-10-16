package com.electrical.services.enquiry;

import jakarta.validation.constraints.NotBlank;

public record StatusUpdateRequest(@NotBlank String status) {}