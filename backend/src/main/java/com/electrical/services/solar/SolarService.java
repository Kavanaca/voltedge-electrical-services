package com.electrical.services.solar;

import com.electrical.services.project.ProjectRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class SolarService {

    private final SolarRepository repository;
    private final ProjectRepository projectRepository;

    public SolarService(SolarRepository repository, ProjectRepository projectRepository) {
        this.repository = repository;
        this.projectRepository = projectRepository;
    }

    public List<SolarResponse> list() {
        return repository.findAllByOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
    }

    public SolarResponse get(Long id) {
        return toResponse(find(id));
    }

    public SolarResponse create(SolarRequest r) {
        SolarInstallation s = new SolarInstallation();
        apply(s, r);
        return toResponse(repository.save(s));
    }

    public SolarResponse update(Long id, SolarRequest r) {
        SolarInstallation s = find(id);
        apply(s, r);
        return toResponse(repository.save(s));
    }

    private SolarInstallation find(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Installation not found"));
    }

    private void apply(SolarInstallation s, SolarRequest r) {
        if (r.projectId() != null && !projectRepository.existsById(r.projectId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
        }
        if (r.surveyDate() != null && r.installDate() != null && r.installDate().isBefore(r.surveyDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Install date cannot be before survey date");
        }
        LocalDate commissioning = r.commissioningDate();
        if ("COMMISSIONED".equals(r.status()) && commissioning == null) {
            commissioning = LocalDate.now();
        }
        if (commissioning != null && r.installDate() != null && commissioning.isBefore(r.installDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Commissioning date cannot be before install date");
        }

        s.setProjectId(r.projectId());
        s.setCustomerName(r.customerName().trim());
        s.setCustomerPhone(r.customerPhone());
        s.setSiteAddress(r.siteAddress().trim());
        s.setSystemType(r.systemType());
        s.setCapacityKw(r.capacityKw());
        s.setPanelBrand(blankToNull(r.panelBrand()));
        s.setPanelCount(r.panelCount());
        s.setPanelWatt(r.panelWatt());
        s.setInverterBrand(blankToNull(r.inverterBrand()));
        s.setInverterKw(r.inverterKw());
        s.setStatus(r.status());
        s.setSurveyDate(r.surveyDate());
        s.setInstallDate(r.installDate());
        s.setCommissioningDate(commissioning);
        s.setWarrantyYears(r.warrantyYears());
        s.setNotes(blankToNull(r.notes()));
    }

    private String blankToNull(String v) {
        return v == null || v.isBlank() ? null : v.trim();
    }

    private SolarResponse toResponse(SolarInstallation s) {
        return new SolarResponse(s.getId(), s.getProjectId(), s.getCustomerName(), s.getCustomerPhone(),
                s.getSiteAddress(), s.getSystemType(), s.getCapacityKw(), s.getPanelBrand(),
                s.getPanelCount(), s.getPanelWatt(), s.getInverterBrand(), s.getInverterKw(),
                s.getStatus(), s.getSurveyDate(), s.getInstallDate(), s.getCommissioningDate(),
                s.getWarrantyYears(), s.getNotes());
    }
}