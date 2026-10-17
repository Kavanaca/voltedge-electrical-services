package com.electrical.services.project;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String projectNumber;
    private Long quotationId;
    private String quotationNumber;
    private String name;
    private String customerName;
    private String customerPhone;
    private String location;
    private String service;
    private String status = "PLANNED";
    private LocalDate startDate;
    private LocalDate endDate;
    private String contractorName;
    private BigDecimal budget;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id")
    private List<ProjectTask> tasks = new ArrayList<>();

    public void addTask(ProjectTask t) {
        t.setProject(this);
        tasks.add(t);
    }

    public Long getId() { return id; }
    public String getProjectNumber() { return projectNumber; }
    public void setProjectNumber(String v) { this.projectNumber = v; }
    public Long getQuotationId() { return quotationId; }
    public void setQuotationId(Long v) { this.quotationId = v; }
    public String getQuotationNumber() { return quotationNumber; }
    public void setQuotationNumber(String v) { this.quotationNumber = v; }
    public String getName() { return name; }
    public void setName(String v) { this.name = v; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String v) { this.customerName = v; }
    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String v) { this.customerPhone = v; }
    public String getLocation() { return location; }
    public void setLocation(String v) { this.location = v; }
    public String getService() { return service; }
    public void setService(String v) { this.service = v; }
    public String getStatus() { return status; }
    public void setStatus(String v) { this.status = v; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate v) { this.startDate = v; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate v) { this.endDate = v; }
    public String getContractorName() { return contractorName; }
    public void setContractorName(String v) { this.contractorName = v; }
    public BigDecimal getBudget() { return budget; }
    public void setBudget(BigDecimal v) { this.budget = v; }
    public String getNotes() { return notes; }
    public void setNotes(String v) { this.notes = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<ProjectTask> getTasks() { return tasks; }
}