package com.electrical.services.enquiry;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/enquiries")
public class EnquiryController {

    private final EnquiryService service;

    public EnquiryController(EnquiryService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EnquiryResponse create(@Valid @RequestBody EnquiryRequest request) {
        return service.create(request);
    }
}