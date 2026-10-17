package com.electrical.services.solar;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SolarRepository extends JpaRepository<SolarInstallation, Long> {
    List<SolarInstallation> findAllByOrderByCreatedAtDesc();
}