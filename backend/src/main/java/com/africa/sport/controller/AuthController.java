package com.africa.sport.controller;

import com.africa.sport.model.Role;
import com.africa.sport.model.User;
import com.africa.sport.repository.UserRepository;
import com.africa.sport.security.JwtService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, JwtService jwtService,
                          AuthenticationManager authenticationManager,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.email)) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Email déjà utilisé"));
        }
        var user = User.builder()
                .email(request.email)
                .password(passwordEncoder.encode(request.password))
                .firstName(request.firstName)
                .lastName(request.lastName)
                .role(Role.PUBLIC_USER)
                .active(true)
                .build();
        userRepository.save(user);
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(token, user.getEmail(),
                user.getFirstName(), user.getLastName(), user.getRole().name()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email, request.password));
        } catch (Exception e) {
            return ResponseEntity.status(401)
                    .body(new ErrorResponse("Email ou mot de passe incorrect"));
        }
        var user = userRepository.findByEmail(request.email).orElseThrow();
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(token, user.getEmail(),
                user.getFirstName(), user.getLastName(), user.getRole().name()));
    }

    // ── DTOs ──────────────────────────────────────────────────────
    public static class RegisterRequest {
        @Email @NotBlank public String email;
        @NotBlank public String password;
        public String firstName;
        public String lastName;
    }

    public static class LoginRequest {
        @Email @NotBlank public String email;
        @NotBlank public String password;
    }

    public static class AuthResponse {
        public String token, email, firstName, lastName, role;
        public AuthResponse(String token, String email, String firstName,
                            String lastName, String role) {
            this.token = token; this.email = email;
            this.firstName = firstName; this.lastName = lastName; this.role = role;
        }
    }

    public static class ErrorResponse {
        public String message;
        public ErrorResponse(String message) { this.message = message; }
    }
}
