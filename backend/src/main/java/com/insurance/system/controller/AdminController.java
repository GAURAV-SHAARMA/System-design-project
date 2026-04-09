package com.insurance.system.controller;

import com.insurance.system.dto.InsuranceDtos;
import com.insurance.system.service.InsuranceService;
import com.insurance.system.service.PlanService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final PlanService planService;
    private final InsuranceService insuranceService;

    public AdminController(PlanService planService, InsuranceService insuranceService) {
        this.planService = planService;
        this.insuranceService = insuranceService;
    }

    @GetMapping("/plans")
    public List<InsuranceDtos.PlanResponse> getAllPlans() {
        return planService.getAllPlansForAdmin();
    }

    @PostMapping("/plans")
    @ResponseStatus(HttpStatus.CREATED)
    public InsuranceDtos.PlanResponse createPlan(@Valid @RequestBody InsuranceDtos.PlanRequest request) {
        return planService.createPlan(request);
    }

    @PutMapping("/plans/{id}")
    public InsuranceDtos.PlanResponse updatePlan(@PathVariable Long id, @Valid @RequestBody InsuranceDtos.PlanRequest request) {
        return planService.updatePlan(id, request);
    }

    @DeleteMapping("/plans/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePlan(@PathVariable Long id) {
        planService.deletePlan(id);
    }

    @GetMapping("/dashboard")
    public InsuranceDtos.DashboardResponse adminDashboard() {
        return insuranceService.getAdminDashboard();
    }

    @GetMapping("/claims")
    public List<InsuranceDtos.ClaimResponse> getClaims() {
        return insuranceService.getAllClaims();
    }

    @PutMapping("/claims/{id}")
    public InsuranceDtos.ClaimResponse decideClaim(@PathVariable Long id, @Valid @RequestBody InsuranceDtos.ClaimDecisionRequest request) {
        return insuranceService.decideClaim(id, request);
    }
}
