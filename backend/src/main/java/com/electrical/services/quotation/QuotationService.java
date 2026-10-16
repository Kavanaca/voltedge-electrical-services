package com.electrical.services.quotation;

import com.electrical.services.enquiry.Enquiry;
import com.electrical.services.enquiry.EnquiryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
public class QuotationService {

    private static final Set<String> STATUSES = Set.of("PENDING", "SENT", "APPROVED", "REJECTED");

    private final QuotationRepository repository;
    private final EnquiryRepository enquiryRepository;

    public QuotationService(QuotationRepository repository, EnquiryRepository enquiryRepository) {
        this.repository = repository;
        this.enquiryRepository = enquiryRepository;
    }

    @Transactional
    public QuotationResponse create(QuotationRequest r) {
        Quotation q = new Quotation();
        q.setEnquiryId(r.enquiryId());
        q.setCustomerName(r.customerName().trim());
        q.setCustomerPhone(r.customerPhone().trim());
        q.setCustomerEmail(r.customerEmail() == null || r.customerEmail().isBlank() ? null : r.customerEmail().trim());
        q.setLocation(r.location().trim());
        q.setService(r.service().trim());
        q.setTerms(r.terms());

        BigDecimal subtotal = BigDecimal.ZERO;
        for (QuotationItemRequest i : r.items()) {
            BigDecimal amount = i.quantity().multiply(i.unitPrice()).setScale(2, RoundingMode.HALF_UP);
            subtotal = subtotal.add(amount);

            QuotationItem item = new QuotationItem();
            item.setItemType(i.itemType());
            item.setDescription(i.description().trim());
            item.setQuantity(i.quantity());
            item.setUnit(i.unit());
            item.setUnitPrice(i.unitPrice());
            item.setAmount(amount);
            q.addItem(item);
        }

        BigDecimal discount = r.discount().setScale(2, RoundingMode.HALF_UP);
        if (discount.compareTo(subtotal) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Discount cannot be more than the subtotal");
        }
        BigDecimal taxable = subtotal.subtract(discount);
        BigDecimal gst = taxable.multiply(r.gstPercent())
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        q.setSubtotal(subtotal);
        q.setDiscount(discount);
        q.setGstPercent(r.gstPercent());
        q.setGstAmount(gst);
        q.setTotal(taxable.add(gst));
        q.setValidUntil(LocalDate.now().plusDays(r.validDays() == null ? 30 : r.validDays()));
        q.setQuotationNumber("QT-" + LocalDate.now().getYear() + "-"
                + String.format("%04d", repository.nextNumber()));

        Quotation saved = repository.save(q);

        if (r.enquiryId() != null) {
            Enquiry e = enquiryRepository.findById(r.enquiryId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enquiry not found"));
            if ("NEW".equals(e.getStatus()) || "CONTACTED".equals(e.getStatus())) {
                e.setStatus("QUOTED");
                enquiryRepository.save(e);
            }
        }
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<QuotationSummary> list() {
        return repository.findAllByOrderByCreatedAtDesc().stream()
                .map(q -> new QuotationSummary(q.getId(), q.getQuotationNumber(), q.getCustomerName(),
                        q.getService(), q.getStatus(), q.getTotal(), q.getCreatedAt()))
                .toList();
    }

    @Transactional(readOnly = true)
    public QuotationResponse get(Long id) {
        return toResponse(find(id));
    }

    @Transactional
    public QuotationResponse updateStatus(Long id, String status) {
        String s = status.trim().toUpperCase();
        if (!STATUSES.contains(s)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status");
        }
        Quotation q = find(id);
        q.setStatus(s);
        return toResponse(repository.save(q));
    }

    private Quotation find(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quotation not found"));
    }

    private QuotationResponse toResponse(Quotation q) {
        List<QuotationItemResponse> items = q.getItems().stream()
                .map(i -> new QuotationItemResponse(i.getId(), i.getItemType(), i.getDescription(),
                        i.getQuantity(), i.getUnit(), i.getUnitPrice(), i.getAmount()))
                .toList();
        return new QuotationResponse(q.getId(), q.getQuotationNumber(), q.getEnquiryId(),
                q.getCustomerName(), q.getCustomerPhone(), q.getCustomerEmail(),
                q.getLocation(), q.getService(), q.getStatus(),
                q.getSubtotal(), q.getDiscount(), q.getGstPercent(), q.getGstAmount(),
                q.getTotal(), q.getValidUntil(), q.getTerms(), q.getCreatedAt(), items);
    }
}