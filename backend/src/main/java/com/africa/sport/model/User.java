package com.africa.sport.model;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String firstName;
    private String lastName;
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private boolean active = true;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    // ── Constructors ──────────────────────────────────────────────
    public User() {}

    public User(String email, String password, String firstName,
                String lastName, Role role) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.active = true;
    }

    // ── Builder ───────────────────────────────────────────────────
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String email, password, firstName, lastName;
        private Role role;
        private boolean active = true;

        public Builder email(String v)     { this.email = v; return this; }
        public Builder password(String v)  { this.password = v; return this; }
        public Builder firstName(String v) { this.firstName = v; return this; }
        public Builder lastName(String v)  { this.lastName = v; return this; }
        public Builder role(Role v)        { this.role = v; return this; }
        public Builder active(boolean v)   { this.active = v; return this; }

        public User build() {
            User u = new User();
            u.email = email; u.password = password;
            u.firstName = firstName; u.lastName = lastName;
            u.role = role; u.active = active;
            return u;
        }
    }

    // ── UserDetails ───────────────────────────────────────────────
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
    @Override public String getUsername()            { return email; }
    @Override public String getPassword()            { return password; }
    @Override public boolean isAccountNonExpired()   { return true; }
    @Override public boolean isAccountNonLocked()    { return active; }
    @Override public boolean isCredentialsNonExpired(){ return true; }
    @Override public boolean isEnabled()             { return active; }

    // ── Getters / Setters ─────────────────────────────────────────
    public Long getId()                    { return id; }
    public String getEmail()               { return email; }
    public void setEmail(String v)         { this.email = v; }
    public void setPassword(String v)      { this.password = v; }
    public String getFirstName()           { return firstName; }
    public void setFirstName(String v)     { this.firstName = v; }
    public String getLastName()            { return lastName; }
    public void setLastName(String v)      { this.lastName = v; }
    public Role getRole()                  { return role; }
    public void setRole(Role v)            { this.role = v; }
    public boolean isActive()              { return active; }
    public void setActive(boolean v)       { this.active = v; }
    public LocalDateTime getCreatedAt()    { return createdAt; }
}
