package com.electrical.services.auth;

public record LoginResponse(String token, String fullName, String email, String role) {}