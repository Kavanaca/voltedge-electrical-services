package com.electrical.services.quotation;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/quotations")
public class QuotationController {

    private final QuotationService service;

    public QuotationController(QuotationService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public QuotationResponse create(@Valid @RequestBody QuotationRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<QuotationSummary> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public QuotationResponse get(@PathVariable Long id) {
        return service.get(id);
    }

    @PatchMapping("/{id}/status")
    public QuotationResponse updateStatus(@PathVariable Long id,
                                          @Valid @RequestBody QuotationStatusRequest req) {
        return service.updateStatus(id, req.status());
    }
}