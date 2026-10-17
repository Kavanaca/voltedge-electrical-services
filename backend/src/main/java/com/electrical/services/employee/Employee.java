package com.electrical.services.employee;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String phone;
    private String role;
    private BigDecimal dailyWage;
    private LocalDate joinDate;
    private boolean active = true;
    private String notes;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public void setFullName(String v) { this.fullName = v; }
    public String getPhone() { return phone; }
    public void setPhone(String v) { this.phone = v; }
    public String getRole() { return role; }
    public void setRole(String v) { this.role = v; }
    public BigDecimal getDailyWage() { return dailyWage; }
    public void setDailyWage(BigDecimal v) { this.dailyWage = v; }
    public LocalDate getJoinDate() { return joinDate; }
    public void setJoinDate(LocalDate v) { this.joinDate = v; }
    public boolean isActive() { return active; }
    public void setActive(boolean v) { this.active = v; }
    public String getNotes() { return notes; }
    public void setNotes(String v) { this.notes = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}