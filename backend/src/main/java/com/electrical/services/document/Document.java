package com.electrical.services.document;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String docType;
    private String title;
    private String issuingAuthority;
    private String documentNumber;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private String notes;
    private String fileName;
    private String storedName;
    private String contentType;
    private Long fileSize;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public String getDocType() { return docType; }
    public void setDocType(String v) { this.docType = v; }
    public String getTitle() { return title; }
    public void setTitle(String v) { this.title = v; }
    public String getIssuingAuthority() { return issuingAuthority; }
    public void setIssuingAuthority(String v) { this.issuingAuthority = v; }
    public String getDocumentNumber() { return documentNumber; }
    public void setDocumentNumber(String v) { this.documentNumber = v; }
    public LocalDate getIssueDate() { return issueDate; }
    public void setIssueDate(LocalDate v) { this.issueDate = v; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate v) { this.expiryDate = v; }
    public String getNotes() { return notes; }
    public void setNotes(String v) { this.notes = v; }
    public String getFileName() { return fileName; }
    public void setFileName(String v) { this.fileName = v; }
    public String getStoredName() { return storedName; }
    public void setStoredName(String v) { this.storedName = v; }
    public String getContentType() { return contentType; }
    public void setContentType(String v) { this.contentType = v; }
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long v) { this.fileSize = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}