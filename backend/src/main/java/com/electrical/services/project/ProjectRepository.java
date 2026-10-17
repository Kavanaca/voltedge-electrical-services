package com.electrical.services.project;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findAllByOrderByCreatedAtDesc();

    boolean existsByQuotationId(Long quotationId);

    @Query(value = "SELECT nextval('project_number_seq')", nativeQuery = true)
    long nextNumber();
}