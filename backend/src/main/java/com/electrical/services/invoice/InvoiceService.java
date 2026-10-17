package com.electrical.services.invoice;

import com.electrical.services.quotation.Quotation;
import com.electrical.services.quotation.QuotationItem;
import com.electrical.services.quotation.QuotationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class InvoiceService {

    private final InvoiceRepository repository;
    private final QuotationRepository quotationRepository;

    public InvoiceService(InvoiceRepository repository, QuotationRepository quotationRepository) {
        this.repository = repository;
        this.quotationRepository = quotationRepository;
    }

    @Transactional
    public InvoiceResponse create(InvoiceRequest r) {
        Quotation q = quotationRepository.findById(r.quotationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quotation not found"));
        if (!"APPROVED".equals(q.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only an APPROVED quotation can be invoiced");
        }
        if (repository.existsByQuotationId(q.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "An invoice already exists for this quotation");
        }

        Invoice inv = new Invoice();
        inv.setQuotationId(q.getId());
        inv.setQuotationNumber(q.getQuotationNumber());
        inv.setCustomerName(q.getCustomerName());
        inv.setCustomerPhone(q.getCustomerPhone());
        inv.setCustomerEmail(q.getCustomerEmail());
        inv.setLocation(q.getLocation());
        inv.setService(q.getService());
        inv.setSubtotal(q.getSubtotal());
        inv.setDiscount(q.getDiscount());
        inv.setGstPercent(q.getGstPercent());
        inv.setGstAmount(q.getGstAmount());
        inv.setTotal(q.getTotal());
        inv.setDueDate(LocalDate.now().plusDays(r.dueDays() == null ? 15 : r.dueDays()));
        inv.setNotes(r.notes() == null || r.notes().isBlank() ? null : r.notes().trim());

        for (QuotationItem qi : q.getItems()) {
            InvoiceItem ii = new InvoiceItem();
            ii.setItemType(qi.getItemType());
            ii.setDescription(qi.getDescription());
            ii.setQuantity(qi.getQuantity());
            ii.setUnit(qi.getUnit());
            ii.setUnitPrice(qi.getUnitPrice());
            ii.setAmount(qi.getAmount());
            inv.addItem(ii);
        }

        inv.setInvoiceNumber("INV-" + LocalDate.now().getYear() + "-"
                + String.format("%04d", repository.nextNumber()));
        return toResponse(repository.save(inv));
    }

    @Transactional(readOnly = true)
    public List<InvoiceSummary> list() {
        return repository.findAllByOrderByCreatedAtDesc().stream()
                .map(i -> {
                    BigDecimal paid = paid(i);
                    return new InvoiceSummary(i.getId(), i.getInvoiceNumber(), i.getQuotationId(),
                            i.getCustomerName(), i.getTotal(), paid, i.getTotal().subtract(paid),
                            paymentStatus(i), i.getDueDate(), i.getCreatedAt());
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public InvoiceResponse get(Long id) {
        return toResponse(find(id));
    }

    @Transactional
    public InvoiceResponse addPayment(Long id, PaymentRequest r) {
        Invoice inv = find(id);
        if ("CANCELLED".equals(inv.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This invoice is cancelled");
        }
        BigDecimal balance = inv.getTotal().subtract(paid(inv));
        if (r.amount().compareTo(balance) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Payment is more than the balance due");
        }
        LocalDate date = r.paymentDate() == null ? LocalDate.now() : r.paymentDate();
        if (date.isAfter(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Payment date cannot be in the future");
        }

        Payment p = new Payment();
        p.setAmount(r.amount());
        p.setMethod(r.method());
        p.setPaymentDate(date);
        p.setReference(r.reference() == null || r.reference().isBlank() ? null : r.reference().trim());
        inv.addPayment(p);
        return toResponse(repository.save(inv));
    }

    @Transactional
    public InvoiceResponse deletePayment(Long id, Long paymentId) {
        Invoice inv = find(id);
        boolean removed = inv.getPayments().removeIf(p -> p.getId().equals(paymentId));
        if (!removed) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found");
        }
        return toResponse(repository.save(inv));
    }

    @Transactional
    public InvoiceResponse cancel(Long id) {
        Invoice inv = find(id);
        if (!inv.getPayments().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Remove the recorded payments before cancelling this invoice");
        }
        inv.setStatus("CANCELLED");
        return toResponse(repository.save(inv));
    }

    private Invoice find(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invoice not found"));
    }

    private BigDecimal paid(Invoice i) {
        return i.getPayments().stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private String paymentStatus(Invoice i) {
        if ("CANCELLED".equals(i.getStatus())) return "CANCELLED";
        BigDecimal paid = paid(i);
        if (paid.compareTo(i.getTotal()) >= 0) return "PAID";
        if (i.getDueDate() != null && i.getDueDate().isBefore(LocalDate.now())) return "OVERDUE";
        if (paid.signum() > 0) return "PARTIAL";
        return "UNPAID";
    }

    private InvoiceResponse toResponse(Invoice i) {
        BigDecimal paid = paid(i);
        List<InvoiceItemResponse> items = i.getItems().stream()
                .map(x -> new InvoiceItemResponse(x.getId(), x.getItemType(), x.getDescription(),
                        x.getQuantity(), x.getUnit(), x.getUnitPrice(), x.getAmount()))
                .toList();
        List<PaymentResponse> payments = i.getPayments().stream()
                .map(p -> new PaymentResponse(p.getId(), p.getAmount(), p.getMethod(),
                        p.getPaymentDate(), p.getReference()))
                .toList();
        return new InvoiceResponse(i.getId(), i.getInvoiceNumber(), i.getQuotationId(), i.getQuotationNumber(),
                i.getCustomerName(), i.getCustomerPhone(), i.getCustomerEmail(),
                i.getLocation(), i.getService(),
                i.getSubtotal(), i.getDiscount(), i.getGstPercent(), i.getGstAmount(), i.getTotal(),
                paid, i.getTotal().subtract(paid), paymentStatus(i),
                i.getDueDate(), i.getNotes(), i.getCreatedAt(), items, payments);
    }
}