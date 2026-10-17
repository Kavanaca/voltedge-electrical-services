package com.electrical.services.project;

import jakarta.validation.constraints.NotBlank;

public record TaskStatusRequest(@NotBlank String status) {}