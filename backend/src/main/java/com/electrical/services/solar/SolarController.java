package com.electrical.services.solar;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/solar")
public class SolarController {

    private final SolarService service;

    public SolarController(SolarService service) {
        this.service = service;
    }

    @GetMapping
    public List<SolarResponse> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public SolarResponse get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SolarResponse create(@Valid @RequestBody SolarRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public SolarResponse update(@PathVariable Long id, @Valid @RequestBody SolarRequest request) {
        return service.update(id, request);
    }
}