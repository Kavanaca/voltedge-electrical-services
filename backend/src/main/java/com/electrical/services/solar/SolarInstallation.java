package com.electrical.services.solar;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "solar_installations")
public class SolarInstallation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long projectId;
    private String customerName;
    private String customerPhone;
    private String siteAddress;
    private String systemType;
    private BigDecimal capacityKw;
    private String panelBrand;
    private Integer panelCount;
    private Integer panelWatt;
    private String inverterBrand;
    private BigDecimal inverterKw;
    private String status = "SURVEY";
    private LocalDate surveyDate;
    private LocalDate installDate;
    private LocalDate commissioningDate;
    private Integer warrantyYears;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public Long getProjectId() { return projectId; }
    public void setProjectId(Long v) { this.projectId = v; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String v) { this.customerName = v; }
    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String v) { this.customerPhone = v; }
    public String getSiteAddress() { return siteAddress; }
    public void setSiteAddress(String v) { this.siteAddress = v; }
    public String getSystemType() { return systemType; }
    public void setSystemType(String v) { this.systemType = v; }
    public BigDecimal getCapacityKw() { return capacityKw; }
    public void setCapacityKw(BigDecimal v) { this.capacityKw = v; }
    public String getPanelBrand() { return panelBrand; }
    public void setPanelBrand(String v) { this.panelBrand = v; }
    public Integer getPanelCount() { return panelCount; }
    public void setPanelCount(Integer v) { this.panelCount = v; }
    public Integer getPanelWatt() { return panelWatt; }
    public void setPanelWatt(Integer v) { this.panelWatt = v; }
    public String getInverterBrand() { return inverterBrand; }
    public void setInverterBrand(String v) { this.inverterBrand = v; }
    public BigDecimal getInverterKw() { return inverterKw; }
    public void setInverterKw(BigDecimal v) { this.inverterKw = v; }
    public String getStatus() { return status; }
    public void setStatus(String v) { this.status = v; }
    public LocalDate getSurveyDate() { return surveyDate; }
    public void setSurveyDate(LocalDate v) { this.surveyDate = v; }
    public LocalDate getInstallDate() { return installDate; }
    public void setInstallDate(LocalDate v) { this.installDate = v; }
    public LocalDate getCommissioningDate() { return commissioningDate; }
    public void setCommissioningDate(LocalDate v) { this.commissioningDate = v; }
    public Integer getWarrantyYears() { return warrantyYears; }
    public void setWarrantyYears(Integer v) { this.warrantyYears = v; }
    public String getNotes() { return notes; }
    public void setNotes(String v) { this.notes = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}