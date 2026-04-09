package com.insurance.system.service;

import com.insurance.system.dto.InsuranceDtos;
import com.insurance.system.exception.ResourceNotFoundException;
import com.insurance.system.model.InsurancePlan;
import com.insurance.system.repository.InsurancePlanRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlanService {

    private final InsurancePlanRepository insurancePlanRepository;

    public PlanService(InsurancePlanRepository insurancePlanRepository) {
        this.insurancePlanRepository = insurancePlanRepository;
    }

    public List<InsuranceDtos.PlanResponse> getAllActivePlans() {
        return insurancePlanRepository.findByActiveTrue().stream().map(this::mapPlan).toList();
    }

    public List<InsuranceDtos.PlanResponse> getAllPlansForAdmin() {
        return insurancePlanRepository.findAll().stream().map(this::mapPlan).toList();
    }

    public InsurancePlan getPlanEntity(Long planId) {
        return insurancePlanRepository.findById(planId).orElseThrow(() -> new ResourceNotFoundException("Plan not found"));
    }

    public InsuranceDtos.PlanResponse createPlan(InsuranceDtos.PlanRequest request) {
        InsurancePlan plan = new InsurancePlan();
        applyRequest(plan, request);
        return mapPlan(insurancePlanRepository.save(plan));
    }

    public InsuranceDtos.PlanResponse updatePlan(Long id, InsuranceDtos.PlanRequest request) {
        InsurancePlan plan = getPlanEntity(id);
        applyRequest(plan, request);
        return mapPlan(insurancePlanRepository.save(plan));
    }

    public void deletePlan(Long id) {
        if (!insurancePlanRepository.existsById(id)) {
            throw new ResourceNotFoundException("Plan not found");
        }
        insurancePlanRepository.deleteById(id);
    }

    private void applyRequest(InsurancePlan plan, InsuranceDtos.PlanRequest request) {
        plan.setPlanName(request.planName());
        plan.setCategory(request.category());
        plan.setDescription(request.description());
        plan.setBasePremium(request.basePremium());
        plan.setCoverageAmount(request.coverageAmount());
        plan.setMinAge(request.minAge());
        plan.setMaxAge(request.maxAge());
        plan.setRiskLevel(request.riskLevel());
        plan.setActive(request.active());
    }

    public InsuranceDtos.PlanResponse mapPlan(InsurancePlan plan) {
        return new InsuranceDtos.PlanResponse(plan.getId(), plan.getPlanName(), plan.getCategory(), plan.getDescription(), plan.getBasePremium(), plan.getCoverageAmount(), plan.getMinAge(), plan.getMaxAge(), plan.getRiskLevel(), plan.isActive());
    }
}
