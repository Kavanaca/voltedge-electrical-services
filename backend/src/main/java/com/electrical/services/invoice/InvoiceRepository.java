package com.electrical.services.invoice;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    List<Invoice> findAllByOrderByCreatedAtDesc();

    boolean existsByQuotationId(Long quotationId);

    @Query(value = "SELECT nextval('invoice_number_seq')", nativeQuery = true)
    long nextNumber();
}