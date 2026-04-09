package com.insurance.system.service;

import com.insurance.system.dto.InsuranceDtos;
import com.insurance.system.exception.BadRequestException;
import com.insurance.system.exception.ResourceNotFoundException;
import com.insurance.system.model.ClaimRequest;
import com.insurance.system.model.ClaimStatus;
import com.insurance.system.model.InsurancePlan;
import com.insurance.system.model.PolicyPurchase;
import com.insurance.system.model.PolicyStatus;
import com.insurance.system.model.User;
import com.insurance.system.repository.ClaimRequestRepository;
import com.insurance.system.repository.PolicyPurchaseRepository;
import com.insurance.system.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class InsuranceService {

    private final PolicyPurchaseRepository policyPurchaseRepository;
    private final ClaimRequestRepository claimRequestRepository;
    private final UserRepository userRepository;
    private final PlanService planService;
    private final NotificationService notificationService;

    public InsuranceService(PolicyPurchaseRepository policyPurchaseRepository, ClaimRequestRepository claimRequestRepository, UserRepository userRepository, PlanService planService, NotificationService notificationService) {
        this.policyPurchaseRepository = policyPurchaseRepository;
        this.claimRequestRepository = claimRequestRepository;
        this.userRepository = userRepository;
        this.planService = planService;
        this.notificationService = notificationService;
    }

    public InsuranceDtos.PurchaseResponse purchasePolicy(String userEmail, InsuranceDtos.PurchaseRequest request) {
        User user = getUserByEmail(userEmail);
        InsurancePlan plan = planService.getPlanEntity(request.planId());
        if (user.getAge() < plan.getMinAge() || user.getAge() > plan.getMaxAge()) {
            throw new BadRequestException("User age is outside the allowed range for this plan.");
        }

        BigDecimal premium = calculatePremium(plan.getBasePremium(), user.getAge(), user.getAnnualIncome(), user.getRiskScore(), request.termYears()).yearlyPremium();
        PolicyPurchase purchase = new PolicyPurchase();
        purchase.setUser(user);
        purchase.setInsurancePlan(plan);
        purchase.setTermYears(request.termYears());
        purchase.setStartDate(LocalDate.now());
        purchase.setEndDate(LocalDate.now().plusYears(request.termYears()));
        purchase.setPremiumAmount(premium);
        purchase.setStatus(PolicyStatus.ACTIVE);
        purchase.setPolicyNumber("POL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        PolicyPurchase saved = policyPurchaseRepository.save(purchase);
        notificationService.create(user, "Policy Purchased", "Your policy " + saved.getPolicyNumber() + " has been activated.");
        return mapPurchase(saved);
    }

    public List<InsuranceDtos.PurchaseResponse> getUserPolicies(String userEmail) {
        User user = getUserByEmail(userEmail);
        return policyPurchaseRepository.findByUserId(user.getId()).stream().map(this::mapPurchase).toList();
    }

    public List<InsuranceDtos.ClaimResponse> getClaimsForUser(String userEmail) {
        User user = getUserByEmail(userEmail);
        return claimRequestRepository.findByPolicyPurchaseUserId(user.getId()).stream().map(this::mapClaim).toList();
    }

    public List<InsuranceDtos.ClaimResponse> getAllClaims() {
        return claimRequestRepository.findAll().stream().map(this::mapClaim).toList();
    }

    public InsuranceDtos.ClaimResponse createClaim(String userEmail, InsuranceDtos.ClaimCreateRequest request) {
        User user = getUserByEmail(userEmail);
        PolicyPurchase purchase = policyPurchaseRepository.findById(request.policyPurchaseId()).orElseThrow(() -> new ResourceNotFoundException("Policy purchase not found"));
        if (!purchase.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You can only claim against your own policy.");
        }
        ClaimRequest claimRequest = new ClaimRequest();
        claimRequest.setPolicyPurchase(purchase);
        claimRequest.setClaimAmount(request.claimAmount());
        claimRequest.setReason(request.reason());
        ClaimRequest saved = claimRequestRepository.save(claimRequest);
        notificationService.create(user, "Claim Submitted", "Claim request for policy " + purchase.getPolicyNumber() + " is pending review.");
        return mapClaim(saved);
    }

    public InsuranceDtos.ClaimResponse decideClaim(Long claimId, InsuranceDtos.ClaimDecisionRequest request) {
        ClaimRequest claim = claimRequestRepository.findById(claimId).orElseThrow(() -> new ResourceNotFoundException("Claim not found"));
        if (request.status() == ClaimStatus.PENDING) {
            throw new BadRequestException("Claim decision must be approved or rejected.");
        }
        claim.setStatus(request.status());
        claim.setAdminRemark(request.adminRemark());
        ClaimRequest saved = claimRequestRepository.save(claim);
        notificationService.create(saved.getPolicyPurchase().getUser(), "Claim " + saved.getStatus().name(), "Claim for policy " + saved.getPolicyPurchase().getPolicyNumber() + " has been " + saved.getStatus().name().toLowerCase() + ".");
        return mapClaim(saved);
    }

    public InsuranceDtos.RecommendationResponse recommend(InsuranceDtos.RecommendationRequest request) {
        List<InsuranceDtos.PlanResponse> scored = planService.getAllActivePlans().stream()
                .filter(plan -> request.age() >= plan.minAge() && request.age() <= plan.maxAge())
                .sorted(Comparator.comparingInt(plan -> scorePlan(plan, request)))
                .limit(3)
                .toList();
        String insight = request.riskScore() >= 8
                ? "High protection profile detected. Prioritize broader coverage and critical illness riders."
                : request.income().compareTo(BigDecimal.valueOf(800000)) > 0
                ? "Strong income profile detected. Wealth protection and family coverage plans are recommended."
                : "Balanced profile detected. Cost-efficient plans with stable yearly premiums are recommended.";
        return new InsuranceDtos.RecommendationResponse(insight, scored);
    }

    public InsuranceDtos.PremiumCalculationResponse calculatePremium(BigDecimal basePremium, Integer age, BigDecimal income, Integer riskScore, Integer termYears) {
        BigDecimal riskMultiplier = BigDecimal.ONE
                .add(BigDecimal.valueOf(riskScore - 5L).multiply(BigDecimal.valueOf(0.06)))
                .add(BigDecimal.valueOf(Math.max(age - 35, 0L)).multiply(BigDecimal.valueOf(0.01)));
        BigDecimal incomeDiscount = income.compareTo(BigDecimal.valueOf(1200000)) >= 0 ? BigDecimal.valueOf(0.10) : income.compareTo(BigDecimal.valueOf(700000)) >= 0 ? BigDecimal.valueOf(0.05) : BigDecimal.ZERO;
        BigDecimal termDiscount = termYears >= 10 ? BigDecimal.valueOf(0.08) : BigDecimal.valueOf(0.03);
        BigDecimal loyaltyDiscount = incomeDiscount.add(termDiscount);
        BigDecimal yearlyPremium = basePremium.multiply(riskMultiplier).multiply(BigDecimal.ONE.subtract(loyaltyDiscount)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal monthlyPremium = yearlyPremium.divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);
        return new InsuranceDtos.PremiumCalculationResponse(monthlyPremium, yearlyPremium, riskMultiplier.setScale(2, RoundingMode.HALF_UP), loyaltyDiscount.setScale(2, RoundingMode.HALF_UP));
    }

    public InsuranceDtos.DashboardResponse getUserDashboard(String userEmail) {
        User user = getUserByEmail(userEmail);
        List<PolicyPurchase> purchases = policyPurchaseRepository.findByUserId(user.getId());
        List<ClaimRequest> claims = claimRequestRepository.findByPolicyPurchaseUserId(user.getId());
        Map<String, Long> categoryMap = purchases.stream().collect(Collectors.groupingBy(item -> item.getInsurancePlan().getCategory(), Collectors.counting()));
        Map<String, Long> claimMap = claims.stream().collect(Collectors.groupingBy(item -> item.getStatus().name(), Collectors.counting()));
        BigDecimal totalPremium = purchases.stream().map(PolicyPurchase::getPremiumAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        return new InsuranceDtos.DashboardResponse(planService.getAllActivePlans().size(), purchases.size(), claims.stream().filter(claim -> claim.getStatus() == ClaimStatus.PENDING).count(), totalPremium, categoryMap.entrySet().stream().map(entry -> new InsuranceDtos.ChartPoint(entry.getKey(), entry.getValue())).toList(), claimMap.entrySet().stream().map(entry -> new InsuranceDtos.ChartPoint(entry.getKey(), entry.getValue())).toList());
    }

    public InsuranceDtos.DashboardResponse getAdminDashboard() {
        List<PolicyPurchase> purchases = policyPurchaseRepository.findAll();
        List<ClaimRequest> claims = claimRequestRepository.findAll();
        Map<String, Long> categoryMap = purchases.stream().collect(Collectors.groupingBy(item -> item.getInsurancePlan().getCategory(), Collectors.counting()));
        Map<String, Long> claimMap = claims.stream().collect(Collectors.groupingBy(item -> item.getStatus().name(), Collectors.counting()));
        BigDecimal totalPremium = purchases.stream().map(PolicyPurchase::getPremiumAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        return new InsuranceDtos.DashboardResponse(planService.getAllPlansForAdmin().size(), purchases.size(), claims.stream().filter(claim -> claim.getStatus() == ClaimStatus.PENDING).count(), totalPremium, categoryMap.entrySet().stream().map(entry -> new InsuranceDtos.ChartPoint(entry.getKey(), entry.getValue())).toList(), claimMap.entrySet().stream().map(entry -> new InsuranceDtos.ChartPoint(entry.getKey(), entry.getValue())).toList());
    }

    private int scorePlan(InsuranceDtos.PlanResponse plan, InsuranceDtos.RecommendationRequest request) {
        int score = 0;
        if (plan.riskLevel().equalsIgnoreCase("HIGH") && request.riskScore() >= 7) score -= 3;
        if (plan.riskLevel().equalsIgnoreCase("LOW") && request.riskScore() <= 4) score -= 3;
        if (request.income().compareTo(BigDecimal.valueOf(900000)) > 0 && plan.coverageAmount().compareTo(BigDecimal.valueOf(2000000)) > 0) score -= 2;
        return score;
    }

    private InsuranceDtos.PurchaseResponse mapPurchase(PolicyPurchase purchase) {
        return new InsuranceDtos.PurchaseResponse(purchase.getId(), purchase.getPolicyNumber(), purchase.getInsurancePlan().getPlanName(), purchase.getPremiumAmount(), purchase.getStartDate(), purchase.getEndDate(), purchase.getStatus());
    }

    private InsuranceDtos.ClaimResponse mapClaim(ClaimRequest claim) {
        return new InsuranceDtos.ClaimResponse(claim.getId(), claim.getPolicyPurchase().getPolicyNumber(), claim.getPolicyPurchase().getInsurancePlan().getPlanName(), claim.getClaimAmount(), claim.getReason(), claim.getStatus(), claim.getAdminRemark(), claim.getRequestedDate());
    }

    private User getUserByEmail(String userEmail) {
        return userRepository.findByEmail(userEmail).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
