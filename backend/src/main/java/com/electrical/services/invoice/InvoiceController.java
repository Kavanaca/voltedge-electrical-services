package com.electrical.services.invoice;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/invoices")
public class InvoiceController {

    private final InvoiceService service;

    public InvoiceController(InvoiceService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InvoiceResponse create(@Valid @RequestBody InvoiceRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<InvoiceSummary> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public InvoiceResponse get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping("/{id}/payments")
    @ResponseStatus(HttpStatus.CREATED)
    public InvoiceResponse addPayment(@PathVariable Long id, @Valid @RequestBody PaymentRequest request) {
        return service.addPayment(id, request);
    }

    @DeleteMapping("/{id}/payments/{paymentId}")
    public InvoiceResponse deletePayment(@PathVariable Long id, @PathVariable Long paymentId) {
        return service.deletePayment(id, paymentId);
    }

    @PatchMapping("/{id}/cancel")
    public InvoiceResponse cancel(@PathVariable Long id) {
        return service.cancel(id);
    }
}