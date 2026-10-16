package com.electrical.services.enquiry;

import org.springframework.stereotype.Service;

@Service
public class EnquiryService {

    private final EnquiryRepository repository;

    public EnquiryService(EnquiryRepository repository) {
        this.repository = repository;
    }

    public EnquiryResponse create(EnquiryRequest req) {
        Enquiry e = new Enquiry();
        e.setName(req.name().trim());
        e.setPhone(req.phone());
        e.setEmail(req.email() == null || req.email().isBlank() ? null : req.email().trim());
        e.setLocation(req.location().trim());
        e.setService(req.service());
        e.setDetails(req.details());
        Enquiry saved = repository.save(e);
        return new EnquiryResponse(saved.getId(), saved.getStatus(), saved.getCreatedAt());
    }
}