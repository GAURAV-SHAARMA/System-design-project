package com.insurance.system.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.Set;

public class AuthDtos {

    public record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank String password
    ) {
    }

    public record RegisterRequest(
            @NotBlank String fullName,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 6) String password,
            @NotNull @Min(18) @Max(100) Integer age,
            @NotNull BigDecimal annualIncome,
            @NotNull @Min(1) @Max(10) Integer riskScore
    ) {
    }

    public record AuthResponse(
            String token,
            Long userId,
            String fullName,
            String email,
            Set<String> roles
    ) {
    }
}
