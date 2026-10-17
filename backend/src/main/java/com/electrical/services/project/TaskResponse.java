package com.electrical.services.project;

import java.time.LocalDate;

public record TaskResponse(Long id, String title, String assignee, LocalDate dueDate, String status) {}