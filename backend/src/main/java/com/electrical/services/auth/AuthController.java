package com.electrical.services.auth;

import com.electrical.services.config.JwtService;
import com.electrical.services.user.User;
import com.electrical.services.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public AuthController(UserRepository users, PasswordEncoder encoder, JwtService jwtService) {
        this.users = users;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        User user = users.findByEmailIgnoreCase(req.email().trim()).orElse(null);
        if (user == null || !user.isEnabled()
                || !encoder.matches(req.password(), user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }
        return ResponseEntity.ok(new LoginResponse(
                jwtService.generateToken(user),
                user.getFullName(), user.getEmail(), user.getRole().name()));
    }
}