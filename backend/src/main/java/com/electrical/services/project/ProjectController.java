package com.electrical.services.project;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/projects")
public class ProjectController {

    private final ProjectService service;

    public ProjectController(ProjectService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse create(@Valid @RequestBody ProjectRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<ProjectSummary> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public ProjectResponse get(@PathVariable Long id) {
        return service.get(id);
    }

    @PutMapping("/{id}")
    public ProjectResponse update(@PathVariable Long id, @Valid @RequestBody ProjectUpdateRequest request) {
        return service.update(id, request);
    }

    @PostMapping("/{id}/tasks")
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse addTask(@PathVariable Long id, @Valid @RequestBody TaskRequest request) {
        return service.addTask(id, request);
    }

    @PatchMapping("/{id}/tasks/{taskId}/status")
    public ProjectResponse updateTaskStatus(@PathVariable Long id, @PathVariable Long taskId,
                                            @Valid @RequestBody TaskStatusRequest request) {
        return service.updateTaskStatus(id, taskId, request.status());
    }

    @DeleteMapping("/{id}/tasks/{taskId}")
    public ProjectResponse deleteTask(@PathVariable Long id, @PathVariable Long taskId) {
        return service.deleteTask(id, taskId);
    }
}