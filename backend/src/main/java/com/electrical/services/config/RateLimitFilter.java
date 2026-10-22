package com.electrical.services.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class RateLimitFilter extends OncePerRequestFilter {

    private record Rule(String name, int max, long windowMs) {}

    private static final Rule LOGIN = new Rule("login", 10, 15 * 60_000L);
    private static final Rule ENQUIRY = new Rule("enquiry", 5, 60 * 60_000L);

    private final Map<String, Deque<Long>> hits = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        Rule rule = ruleFor(request);
        if (rule != null && !allow(rule, request.getRemoteAddr())) {
            response.setStatus(429);
            response.setContentType("application/json");
            response.setHeader("Retry-After", String.valueOf(rule.windowMs() / 1000));
            response.getWriter().write("{\"message\":\"Too many requests. Please try again later.\"}");
            return;
        }
        chain.doFilter(request, response);
    }

    private Rule ruleFor(HttpServletRequest req) {
        if (!"POST".equals(req.getMethod())) return null;
        String path = req.getRequestURI();
        if ("/api/auth/login".equals(path)) return LOGIN;
        if ("/api/public/enquiries".equals(path)) return ENQUIRY;
        return null;
    }

    private boolean allow(Rule rule, String ip) {
        long now = System.currentTimeMillis();
        Deque<Long> q = hits.computeIfAbsent(rule.name() + ":" + ip, k -> new ArrayDeque<>());
        synchronized (q) {
            while (!q.isEmpty() && now - q.peekFirst() > rule.windowMs()) q.pollFirst();
            if (q.size() >= rule.max()) return false;
            q.addLast(now);
        }
        if (hits.size() > 10_000) {
            hits.values().removeIf(d -> {
                synchronized (d) {
                    return d.isEmpty() || now - d.peekLast() > 3_600_000L;
                }
            });
        }
        return true;
    }
}