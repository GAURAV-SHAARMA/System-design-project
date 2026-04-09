package com.insurance.system.config;

import com.insurance.system.model.ClaimRequest;
import com.insurance.system.model.ClaimStatus;
import com.insurance.system.model.InsurancePlan;
import com.insurance.system.model.Notification;
import com.insurance.system.model.PolicyPurchase;
import com.insurance.system.model.PolicyStatus;
import com.insurance.system.model.Role;
import com.insurance.system.model.User;
import com.insurance.system.repository.ClaimRequestRepository;
import com.insurance.system.repository.InsurancePlanRepository;
import com.insurance.system.repository.NotificationRepository;
import com.insurance.system.repository.PolicyPurchaseRepository;
import com.insurance.system.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initData(UserRepository userRepository, InsurancePlanRepository insurancePlanRepository, PolicyPurchaseRepository policyPurchaseRepository, ClaimRequestRepository claimRequestRepository, NotificationRepository notificationRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() > 0) {
                return;
            }
            User admin = new User();
            admin.setFullName("System Admin");
            admin.setEmail("admin@insurance.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setAge(35);
            admin.setAnnualIncome(BigDecimal.valueOf(1500000));
            admin.setRiskScore(3);
            admin.setRoles(Set.of(Role.ROLE_ADMIN));

            User user = new User();
            user.setFullName("Riya Sharma");
            user.setEmail("user@insurance.com");
            user.setPassword(passwordEncoder.encode("User@123"));
            user.setAge(29);
            user.setAnnualIncome(BigDecimal.valueOf(780000));
            user.setRiskScore(4);
            user.setRoles(Set.of(Role.ROLE_USER));
            userRepository.saveAll(List.of(admin, user));

            InsurancePlan health = createPlan("Smart Health Shield", "Health", "Comprehensive family health plan with OPD and critical illness support.", 18500, 1500000, 18, 60, "LOW", true);
            InsurancePlan life = createPlan("Future Secure Life", "Life", "Long-term life coverage designed for salaried professionals and young families.", 26000, 3000000, 21, 55, "MEDIUM", true);
            InsurancePlan vehicle = createPlan("DriveSafe Auto", "Vehicle", "Vehicle protection with cashless garages, roadside assistance, and fast claim initiation.", 12000, 800000, 18, 65, "MEDIUM", true);
            InsurancePlan premium = createPlan("Elite Wealth Protect", "Investment", "Premium wealth and legacy protection plan with high coverage and tax benefits.", 42000, 5000000, 25, 55, "HIGH", true);
            insurancePlanRepository.saveAll(List.of(health, life, vehicle, premium));

            PolicyPurchase purchase = new PolicyPurchase();
            purchase.setUser(user);
            purchase.setInsurancePlan(health);
            purchase.setPolicyNumber("POL-DEMO001");
            purchase.setPremiumAmount(BigDecimal.valueOf(17205));
            purchase.setTermYears(3);
            purchase.setStartDate(LocalDate.now().minusMonths(2));
            purchase.setEndDate(LocalDate.now().plusYears(3));
            purchase.setStatus(PolicyStatus.ACTIVE);
            policyPurchaseRepository.save(purchase);

            ClaimRequest claim = new ClaimRequest();
            claim.setPolicyPurchase(purchase);
            claim.setClaimAmount(BigDecimal.valueOf(25000));
            claim.setReason("Hospitalization reimbursement request");
            claim.setStatus(ClaimStatus.PENDING);
            claimRequestRepository.save(claim);

            Notification notification = new Notification();
            notification.setUser(user);
            notification.setTitle("Welcome to InsureSmart");
            notification.setMessage("Your demo account is ready. Explore plans, premium calculator, and dashboard insights.");
            notification.setReadStatus(false);
            notificationRepository.save(notification);
        };
    }

    private InsurancePlan createPlan(String planName, String category, String description, int premium, int coverage, int minAge, int maxAge, String riskLevel, boolean active) {
        InsurancePlan plan = new InsurancePlan();
        plan.setPlanName(planName);
        plan.setCategory(category);
        plan.setDescription(description);
        plan.setBasePremium(BigDecimal.valueOf(premium));
        plan.setCoverageAmount(BigDecimal.valueOf(coverage));
        plan.setMinAge(minAge);
        plan.setMaxAge(maxAge);
        plan.setRiskLevel(riskLevel);
        plan.setActive(active);
        return plan;
    }
}
