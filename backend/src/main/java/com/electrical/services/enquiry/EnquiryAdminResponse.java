package com.electrical.services.enquiry;

import java.time.LocalDateTime;

public record EnquiryAdminResponse(
        Long id, String name, String phone, String email, String location,
        String service, String details, String status, LocalDateTime createdAt) {}