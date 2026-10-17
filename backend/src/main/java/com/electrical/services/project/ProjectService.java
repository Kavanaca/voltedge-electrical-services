package com.electrical.services.project;

import com.electrical.services.employee.Employee;
import com.electrical.services.employee.EmployeeRepository;
import com.electrical.services.quotation.Quotation;
import com.electrical.services.quotation.QuotationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.Set;

@Service
public class ProjectService {

    private static final Set<String> STATUSES =
            Set.of("PLANNED", "IN_PROGRESS", "ON_HOLD", "COMPLETED", "CANCELLED");
    private static final Set<String> TASK_STATUSES = Set.of("TODO", "IN_PROGRESS", "DONE");

    private final ProjectRepository repository;
    private final QuotationRepository quotationRepository;
    private final EmployeeRepository employeeRepository;

    public ProjectService(ProjectRepository repository, QuotationRepository quotationRepository,
                          EmployeeRepository employeeRepository) {
        this.repository = repository;
        this.quotationRepository = quotationRepository;
        this.employeeRepository = employeeRepository;
    }

    @Transactional
    public ProjectResponse create(ProjectRequest r) {
        Quotation q = quotationRepository.findById(r.quotationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quotation not found"));
        if (!"APPROVED".equals(q.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only an APPROVED quotation can become a project");
        }
        if (repository.existsByQuotationId(q.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "A project already exists for this quotation");
        }
        checkDates(r.startDate(), r.endDate());

        Project p = new Project();
        p.setQuotationId(q.getId());
        p.setQuotationNumber(q.getQuotationNumber());
        p.setName(r.name().trim());
        p.setCustomerName(q.getCustomerName());
        p.setCustomerPhone(q.getCustomerPhone());
        p.setLocation(q.getLocation());
        p.setService(q.getService());
        p.setStartDate(r.startDate());
        p.setEndDate(r.endDate());
        p.setContractorName(blankToNull(r.contractorName()));
        p.setBudget(q.getTotal());
        p.setNotes(r.notes());
        p.setProjectNumber("PRJ-" + Year.now().getValue() + "-"
                + String.format("%04d", repository.nextNumber()));
        return toResponse(repository.save(p));
    }

    @Transactional(readOnly = true)
    public List<ProjectSummary> list() {
        return repository.findAllByOrderByCreatedAtDesc().stream()
                .map(p -> new ProjectSummary(p.getId(), p.getProjectNumber(), p.getName(),
                        p.getCustomerName(), p.getStatus(), progress(p), p.getEndDate(), p.getBudget()))
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectResponse get(Long id) {
        return toResponse(find(id));
    }

    @Transactional
    public ProjectResponse update(Long id, ProjectUpdateRequest r) {
        String status = r.status().trim().toUpperCase();
        if (!STATUSES.contains(status)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status");
        }
        checkDates(r.startDate(), r.endDate());
        Project p = find(id);
        p.setName(r.name().trim());
        p.setStatus(status);
        p.setStartDate(r.startDate());
        p.setEndDate(r.endDate());
        p.setContractorName(blankToNull(r.contractorName()));
        p.setNotes(r.notes());
        return toResponse(repository.save(p));
    }

    @Transactional
    public ProjectResponse addTask(Long projectId, TaskRequest r) {
        Project p = find(projectId);
        ProjectTask t = new ProjectTask();
        t.setTitle(r.title().trim());
        t.setDueDate(r.dueDate());
        if (r.employeeId() != null) {
            Employee e = employeeRepository.findById(r.employeeId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));
            if (!e.isActive()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This employee is inactive");
            }
            t.setEmployeeId(e.getId());
            t.setAssignee(e.getFullName());
        }
        p.addTask(t);
        return toResponse(repository.save(p));
    }

    @Transactional
    public ProjectResponse updateTaskStatus(Long projectId, Long taskId, String status) {
        String s = status.trim().toUpperCase();
        if (!TASK_STATUSES.contains(s)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid task status");
        }
        Project p = find(projectId);
        ProjectTask t = p.getTasks().stream()
                .filter(x -> x.getId().equals(taskId)).findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));
        t.setStatus(s);
        return toResponse(repository.save(p));
    }

    @Transactional
    public ProjectResponse deleteTask(Long projectId, Long taskId) {
        Project p = find(projectId);
        boolean removed = p.getTasks().removeIf(t -> t.getId().equals(taskId));
        if (!removed) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found");
        }
        return toResponse(repository.save(p));
    }

    private Project find(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
    }

    private void checkDates(LocalDate start, LocalDate end) {
        if (start != null && end != null && end.isBefore(start)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End date cannot be before start date");
        }
    }

    private String blankToNull(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }

    private int progress(Project p) {
        int total = p.getTasks().size();
        if (total == 0) return 0;
        long done = p.getTasks().stream().filter(t -> "DONE".equals(t.getStatus())).count();
        return (int) (done * 100 / total);
    }

    private ProjectResponse toResponse(Project p) {
        List<TaskResponse> tasks = p.getTasks().stream()
                .map(t -> new TaskResponse(t.getId(), t.getTitle(), t.getEmployeeId(), t.getAssignee(),
                        t.getDueDate(), t.getStatus()))
                .toList();
        return new ProjectResponse(p.getId(), p.getProjectNumber(), p.getQuotationId(), p.getQuotationNumber(),
                p.getName(), p.getCustomerName(), p.getCustomerPhone(), p.getLocation(), p.getService(),
                p.getStatus(), p.getStartDate(), p.getEndDate(), p.getContractorName(), p.getBudget(),
                p.getNotes(), p.getCreatedAt(), progress(p), tasks);
    }
}