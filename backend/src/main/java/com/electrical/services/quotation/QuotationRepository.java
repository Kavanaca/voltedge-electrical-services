package com.electrical.services.quotation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuotationRepository extends JpaRepository<Quotation, Long> {

    List<Quotation> findAllByOrderByCreatedAtDesc();

    @Query(value = "SELECT nextval('quotation_number_seq')", nativeQuery = true)
    long nextNumber();
}