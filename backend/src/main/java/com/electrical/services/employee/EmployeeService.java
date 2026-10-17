package com.electrical.services.employee;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository repository;

    public EmployeeService(EmployeeRepository repository) {
        this.repository = repository;
    }

    public List<EmployeeResponse> list() {
        return repository.findAllByOrderByFullNameAsc().stream().map(this::toResponse).toList();
    }

    public EmployeeResponse create(EmployeeRequest r) {
        Employee e = new Employee();
        apply(e, r);
        return toResponse(repository.save(e));
    }

    public EmployeeResponse update(Long id, EmployeeRequest r) {
        Employee e = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));
        apply(e, r);
        return toResponse(repository.save(e));
    }

    private void apply(Employee e, EmployeeRequest r) {
        e.setFullName(r.fullName().trim());
        e.setPhone(r.phone());
        e.setRole(r.role());
        e.setDailyWage(r.dailyWage());
        e.setJoinDate(r.joinDate());
        e.setActive(r.active());
        e.setNotes(r.notes() == null || r.notes().isBlank() ? null : r.notes().trim());
    }

    private EmployeeResponse toResponse(Employee e) {
        return new EmployeeResponse(e.getId(), e.getFullName(), e.getPhone(), e.getRole(),
                e.getDailyWage(), e.getJoinDate(), e.isActive(), e.getNotes());
    }
}