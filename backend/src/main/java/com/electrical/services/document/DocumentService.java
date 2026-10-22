package com.electrical.services.document;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class DocumentService {

    private static final int WARN_DAYS = 60;

    private final DocumentRepository repository;
    private final FileStorageService storage;

    public DocumentService(DocumentRepository repository, FileStorageService storage) {
        this.repository = repository;
        this.storage = storage;
    }

    @Transactional(readOnly = true)
    public List<DocumentResponse> list() {
        return repository.findAllByOrderByExpiryDateAsc().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public DocumentResponse get(Long id) {
        return toResponse(find(id));
    }

    @Transactional
    public DocumentResponse create(DocumentRequest r) {
        Document d = new Document();
        apply(d, r);
        return toResponse(repository.save(d));
    }

    @Transactional
    public DocumentResponse update(Long id, DocumentRequest r) {
        Document d = find(id);
        apply(d, r);
        return toResponse(repository.save(d));
    }

    @Transactional
    public DocumentResponse uploadFile(Long id, MultipartFile file) {
        Document d = find(id);
        StoredFile stored = storage.store(file);
        String old = d.getStoredName();
        d.setStoredName(stored.storedName());
        d.setFileName(stored.originalName());
        d.setContentType(stored.contentType());
        d.setFileSize(stored.size());
        Document saved = repository.save(d);
        storage.delete(old);
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        Document d = find(id);
        String stored = d.getStoredName();
        repository.delete(d);
        storage.delete(stored);
    }

    @Transactional(readOnly = true)
    public Document findWithFile(Long id) {
        Document d = find(id);
        if (d.getStoredName() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No file attached to this document");
        }
        return d;
    }

    public Resource load(Document d) {
        return storage.load(d.getStoredName());
    }

    private Document find(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found"));
    }

    private void apply(Document d, DocumentRequest r) {
        if (r.issueDate() != null && r.expiryDate() != null && r.expiryDate().isBefore(r.issueDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Expiry date cannot be before issue date");
        }
        d.setDocType(r.docType());
        d.setTitle(r.title().trim());
        d.setIssuingAuthority(blankToNull(r.issuingAuthority()));
        d.setDocumentNumber(blankToNull(r.documentNumber()));
        d.setIssueDate(r.issueDate());
        d.setExpiryDate(r.expiryDate());
        d.setNotes(blankToNull(r.notes()));
    }

    private String blankToNull(String v) {
        return v == null || v.isBlank() ? null : v.trim();
    }

    private DocumentResponse toResponse(Document d) {
        String status = "NO_EXPIRY";
        Long daysLeft = null;
        if (d.getExpiryDate() != null) {
            daysLeft = ChronoUnit.DAYS.between(LocalDate.now(), d.getExpiryDate());
            status = daysLeft < 0 ? "EXPIRED" : daysLeft <= WARN_DAYS ? "EXPIRING_SOON" : "VALID";
        }
        return new DocumentResponse(d.getId(), d.getDocType(), d.getTitle(), d.getIssuingAuthority(),
                d.getDocumentNumber(), d.getIssueDate(), d.getExpiryDate(), d.getNotes(),
                d.getStoredName() != null, d.getFileName(), d.getFileSize(), status, daysLeft);
    }
}