package com.insurance.system.dto;

import com.insurance.system.model.ClaimStatus;
import com.insurance.system.model.PolicyStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class InsuranceDtos {

    public record PlanRequest(
            @NotBlank String planName,
            @NotBlank String category,
            @NotBlank String description,
            @NotNull BigDecimal basePremium,
            @NotNull BigDecimal coverageAmount,
            @NotNull Integer minAge,
            @NotNull Integer maxAge,
            @NotBlank String riskLevel,
            boolean active
    ) {
    }

    public record PlanResponse(
            Long id,
            String planName,
            String category,
            String description,
            BigDecimal basePremium,
            BigDecimal coverageAmount,
            Integer minAge,
            Integer maxAge,
            String riskLevel,
            boolean active
    ) {
    }

    public record PurchaseRequest(
            @NotNull Long planId,
            @NotNull @Min(1) @Max(30) Integer termYears
    ) {
    }

    public record PurchaseResponse(
            Long id,
            String policyNumber,
            String planName,
            BigDecimal premiumAmount,
            LocalDate startDate,
            LocalDate endDate,
            PolicyStatus status
    ) {
    }

    public record ClaimCreateRequest(
            @NotNull Long policyPurchaseId,
            @NotNull BigDecimal claimAmount,
            @NotBlank String reason
    ) {
    }

    public record ClaimDecisionRequest(
            @NotNull ClaimStatus status,
            String adminRemark
    ) {
    }

    public record ClaimResponse(
            Long id,
            String policyNumber,
            String planName,
            BigDecimal claimAmount,
            String reason,
            ClaimStatus status,
            String adminRemark,
            LocalDate requestedDate
    ) {
    }

    public record RecommendationRequest(
            @NotNull @Min(18) @Max(100) Integer age,
            @NotNull BigDecimal income,
            @NotNull @Min(1) @Max(10) Integer riskScore
    ) {
    }

    public record RecommendationResponse(
            String insight,
            List<PlanResponse> plans
    ) {
    }

    public record PremiumCalculationRequest(
            @NotNull BigDecimal basePremium,
            @NotNull @Min(18) @Max(100) Integer age,
            @NotNull BigDecimal income,
            @NotNull @Min(1) @Max(10) Integer riskScore,
            @NotNull @Min(1) @Max(30) Integer termYears
    ) {
    }

    public record PremiumCalculationResponse(
            BigDecimal monthlyPremium,
            BigDecimal yearlyPremium,
            BigDecimal riskMultiplier,
            BigDecimal loyaltyDiscount
    ) {
    }

    public record NotificationResponse(
            Long id,
            String title,
            String message,
            boolean readStatus,
            String createdAt
    ) {
    }

    public record DashboardResponse(
            long totalPlans,
            long activePolicies,
            long pendingClaims,
            BigDecimal totalPremiumCollected,
            List<ChartPoint> policyCategoryChart,
            List<ChartPoint> claimStatusChart
    ) {
    }

    public record ChartPoint(
            String label,
            Number value
    ) {
    }
}
