package com.electrical.services.user;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder encoder;

    public UserService(UserRepository repository, PasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    public List<UserResponse> list() {
        return repository.findAll(Sort.by("createdAt")).stream().map(this::toResponse).toList();
    }

    public UserResponse create(UserRequest r) {
        String email = r.email().trim().toLowerCase();
        if (repository.findByEmailIgnoreCase(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A user with this email already exists");
        }
        User u = new User();
        u.setFullName(r.fullName().trim());
        u.setEmail(email);
        u.setPasswordHash(encoder.encode(r.password()));
        u.setRole(Role.ADMIN);
        return toResponse(repository.save(u));
    }

    public UserResponse setEnabled(Long id, boolean enabled, String currentEmail) {
        User u = find(id);
        if (!enabled && u.getEmail().equalsIgnoreCase(currentEmail)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot disable your own account");
        }
        u.setEnabled(enabled);
        return toResponse(repository.save(u));
    }

    public void delete(Long id, String currentEmail) {
        User u = find(id);
        if (u.getEmail().equalsIgnoreCase(currentEmail)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot delete your own account");
        }
        if (repository.count() <= 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The last admin cannot be deleted");
        }
        repository.delete(u);
    }

    private User find(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private UserResponse toResponse(User u) {
        return new UserResponse(u.getId(), u.getFullName(), u.getEmail(),
                u.getRole().name(), u.isEnabled(), u.getCreatedAt());
    }
}