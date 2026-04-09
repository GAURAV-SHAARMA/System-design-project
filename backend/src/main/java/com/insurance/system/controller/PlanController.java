package com.insurance.system.controller;

import com.insurance.system.dto.InsuranceDtos;
import com.insurance.system.service.PlanService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
public class PlanController {

    private final PlanService planService;

    public PlanController(PlanService planService) {
        this.planService = planService;
    }

    @GetMapping
    public List<InsuranceDtos.PlanResponse> getPlans() {
        return planService.getAllActivePlans();
    }
}
