package com.electrical.services.enquiry;

import java.time.LocalDateTime;

public record EnquiryResponse(Long id, String status, LocalDateTime createdAt) {}