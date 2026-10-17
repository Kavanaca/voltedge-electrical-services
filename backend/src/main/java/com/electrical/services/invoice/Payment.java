package com.electrical.services.invoice;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id")
    private Invoice invoice;

    private BigDecimal amount;
    private String method;
    private LocalDate paymentDate;
    private String reference;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public Invoice getInvoice() { return invoice; }
    public void setInvoice(Invoice invoice) { this.invoice = invoice; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal v) { this.amount = v; }
    public String getMethod() { return method; }
    public void setMethod(String v) { this.method = v; }
    public LocalDate getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDate v) { this.paymentDate = v; }
    public String getReference() { return reference; }
    public void setReference(String v) { this.reference = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}