package com.electrical.services.enquiry;

import jakarta.validation.constraints.*;

public record EnquiryRequest(
        @NotBlank @Size(max = 100) String name,
        @NotBlank @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit mobile number") String phone,
        @Email @Size(max = 150) String email,
        @NotBlank @Size(max = 200) String location,
        @NotBlank @Size(max = 100) String service,
        @Size(max = 2000) String details
) {}