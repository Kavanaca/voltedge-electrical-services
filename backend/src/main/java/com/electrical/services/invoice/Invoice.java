package com.electrical.services.invoice;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String invoiceNumber;
    private Long quotationId;
    private String quotationNumber;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String location;
    private String service;
    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal gstPercent;
    private BigDecimal gstAmount;
    private BigDecimal total;
    private LocalDate dueDate;
    private String status = "ISSUED";

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id")
    private List<InvoiceItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("paymentDate, id")
    private List<Payment> payments = new ArrayList<>();

    public void addItem(InvoiceItem i) {
        i.setInvoice(this);
        items.add(i);
    }

    public void addPayment(Payment p) {
        p.setInvoice(this);
        payments.add(p);
    }

    public Long getId() { return id; }
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String v) { this.invoiceNumber = v; }
    public Long getQuotationId() { return quotationId; }
    public void setQuotationId(Long v) { this.quotationId = v; }
    public String getQuotationNumber() { return quotationNumber; }
    public void setQuotationNumber(String v) { this.quotationNumber = v; }
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
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate v) { this.dueDate = v; }
    public String getStatus() { return status; }
    public void setStatus(String v) { this.status = v; }
    public String getNotes() { return notes; }
    public void setNotes(String v) { this.notes = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<InvoiceItem> getItems() { return items; }
    public List<Payment> getPayments() { return payments; }
}