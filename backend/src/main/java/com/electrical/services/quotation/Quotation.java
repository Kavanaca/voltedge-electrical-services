package com.electrical.services.quotation;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quotations")
public class Quotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String quotationNumber;
    private Long enquiryId;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String location;
    private String service;
    private String status = "PENDING";
    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal gstPercent;
    private BigDecimal gstAmount;
    private BigDecimal total;
    private LocalDate validUntil;

    @Column(columnDefinition = "TEXT")
    private String terms;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "quotation", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id")
    private List<QuotationItem> items = new ArrayList<>();

    public void addItem(QuotationItem item) {
        item.setQuotation(this);
        items.add(item);
    }

    public Long getId() { return id; }
    public String getQuotationNumber() { return quotationNumber; }
    public void setQuotationNumber(String v) { this.quotationNumber = v; }
    public Long getEnquiryId() { return enquiryId; }
    public void setEnquiryId(Long v) { this.enquiryId = v; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String v) { this.customerName = v; }
    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String v) { this.customerPhone = v; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String v) { this.customerEmail = v; }
    public String getLocation() { return location; }
    public void setLocation(String v) { this.location = v; }
    public String getService() { return service; }
    public void setService(String v) { this.service = v; }
    public String getStatus() { return status; }
    public void setStatus(String v) { this.status = v; }
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal v) { this.subtotal = v; }
    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal v) { this.discount = v; }
    public BigDecimal getGstPercent() { return gstPercent; }
    public void setGstPercent(BigDecimal v) { this.gstPercent = v; }
    public BigDecimal getGstAmount() { return gstAmount; }
    public void setGstAmount(BigDecimal v) { this.gstAmount = v; }
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal v) { this.total = v; }
    public LocalDate getValidUntil() { return validUntil; }
    public void setValidUntil(LocalDate v) { this.validUntil = v; }
    public String getTerms() { return terms; }
    public void setTerms(String v) { this.terms = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<QuotationItem> getItems() { return items; }
}