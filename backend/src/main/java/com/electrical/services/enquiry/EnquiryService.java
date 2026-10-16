package com.electrical.services.enquiry;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;

@Service
public class EnquiryService {

    private static final Set<String> STATUSES = Set.of("NEW", "CONTACTED", "QUOTED", "CLOSED");

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

    public List<EnquiryAdminResponse> list() {
        return repository.findAllByOrderByCreatedAtDesc().stream().map(this::toAdmin).toList();
    }

    public EnquiryAdminResponse updateStatus(Long id, String status) {
        String s = status.trim().toUpperCase();
        if (!STATUSES.contains(s)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status");
        }
        Enquiry e = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enquiry not found"));
        e.setStatus(s);
        return toAdmin(repository.save(e));
    }

    private EnquiryAdminResponse toAdmin(Enquiry e) {
        return new EnquiryAdminResponse(e.getId(), e.getName(), e.getPhone(), e.getEmail(),
                e.getLocation(), e.getService(), e.getDetails(), e.getStatus(), e.getCreatedAt());
    }
}