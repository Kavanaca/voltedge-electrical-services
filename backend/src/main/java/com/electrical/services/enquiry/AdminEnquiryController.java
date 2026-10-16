package com.electrical.services.enquiry;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/enquiries")
public class AdminEnquiryController {

    private final EnquiryService service;

    public AdminEnquiryController(EnquiryService service) {
        this.service = service;
    }

    @GetMapping
    public List<EnquiryAdminResponse> list() {
        return service.list();
    }

    @PatchMapping("/{id}/status")
    public EnquiryAdminResponse updateStatus(@PathVariable Long id,
                                             @Valid @RequestBody StatusUpdateRequest req) {
        return service.updateStatus(id, req.status());
    }
}