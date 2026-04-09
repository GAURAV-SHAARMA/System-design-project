package com.insurance.system.service;

import com.insurance.system.dto.AuthDtos;
import com.insurance.system.exception.BadRequestException;
import com.insurance.system.model.Role;
import com.insurance.system.model.User;
import com.insurance.system.repository.UserRepository;
import com.insurance.system.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email is already registered.");
        }
        User user = new User();
        user.setFullName(request.fullName());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setAge(request.age());
        user.setAnnualIncome(request.annualIncome());
        user.setRiskScore(request.riskScore());
        user.setRoles(Set.of(Role.ROLE_USER));
        User savedUser = userRepository.save(user);

        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(savedUser.getEmail())
                .password(savedUser.getPassword())
                .authorities(savedUser.getRoles().stream().map(Enum::name).toArray(String[]::new))
                .build();

        return new AuthDtos.AuthResponse(jwtService.generateToken(userDetails), savedUser.getId(), savedUser.getFullName(), savedUser.getEmail(), savedUser.getRoles().stream().map(Enum::name).collect(Collectors.toSet()));
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        User user = userRepository.findByEmail(request.email()).orElseThrow(() -> new BadRequestException("Invalid credentials"));

        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(user.getRoles().stream().map(Enum::name).toArray(String[]::new))
                .build();

        return new AuthDtos.AuthResponse(jwtService.generateToken(userDetails), user.getId(), user.getFullName(), user.getEmail(), user.getRoles().stream().map(Enum::name).collect(Collectors.toSet()));
    }
}
