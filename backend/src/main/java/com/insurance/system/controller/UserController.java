package com.insurance.system.controller;

import com.insurance.system.dto.InsuranceDtos;
import com.insurance.system.service.InsuranceService;
import com.insurance.system.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final InsuranceService insuranceService;
    private final NotificationService notificationService;

    public UserController(InsuranceService insuranceService, NotificationService notificationService) {
        this.insuranceService = insuranceService;
        this.notificationService = notificationService;
    }

    @PostMapping("/purchase")
    public InsuranceDtos.PurchaseResponse purchasePolicy(Authentication authentication, @Valid @RequestBody InsuranceDtos.PurchaseRequest request) {
        return insuranceService.purchasePolicy(authentication.getName(), request);
    }

    @GetMapping("/policies")
    public List<InsuranceDtos.PurchaseResponse> getPolicies(Authentication authentication) {
        return insuranceService.getUserPolicies(authentication.getName());
    }

    @GetMapping("/claims")
    public List<InsuranceDtos.ClaimResponse> getClaims(Authentication authentication) {
        return insuranceService.getClaimsForUser(authentication.getName());
    }

    @PostMapping("/claims")
    public InsuranceDtos.ClaimResponse submitClaim(Authentication authentication, @Valid @RequestBody InsuranceDtos.ClaimCreateRequest request) {
        return insuranceService.createClaim(authentication.getName(), request);
    }

    @PostMapping("/recommendations")
    public InsuranceDtos.RecommendationResponse recommend(@Valid @RequestBody InsuranceDtos.RecommendationRequest request) {
        return insuranceService.recommend(request);
    }

    @PostMapping("/premium-calculator")
    public InsuranceDtos.PremiumCalculationResponse calculate(@Valid @RequestBody InsuranceDtos.PremiumCalculationRequest request) {
        return insuranceService.calculatePremium(request.basePremium(), request.age(), request.income(), request.riskScore(), request.termYears());
    }

    @GetMapping("/dashboard")
    public InsuranceDtos.DashboardResponse dashboard(Authentication authentication) {
        return insuranceService.getUserDashboard(authentication.getName());
    }

    @GetMapping("/notifications")
    public List<InsuranceDtos.NotificationResponse> notifications(Authentication authentication) {
        return notificationService.getUserNotificationsByEmail(authentication.getName());
    }
}
