package com.electrical.services.config;

import com.electrical.services.user.Role;
import com.electrical.services.user.User;
import com.electrical.services.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

    private final UserRepository users;
    private final PasswordEncoder encoder;

    @Value("${app.admin.name}") private String name;
    @Value("${app.admin.email}") private String email;
    @Value("${app.admin.password}") private String password;

    public AdminSeeder(UserRepository users, PasswordEncoder encoder) {
        this.users = users;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        if (users.count() > 0) return;
        if (email.isBlank() || password.length() < 8) {
            log.warn("No admin created: set ADMIN_EMAIL and ADMIN_PASSWORD (min 8 characters).");
            return;
        }
        User admin = new User();
        admin.setFullName(name);
        admin.setEmail(email.trim().toLowerCase());
        admin.setPasswordHash(encoder.encode(password));
        admin.setRole(Role.ADMIN);
        users.save(admin);
        log.info("First admin account created: {}", admin.getEmail());
    }
}