package com.insurance.system.repository;

import com.insurance.system.model.InsurancePlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InsurancePlanRepository extends JpaRepository<InsurancePlan, Long> {
    List<InsurancePlan> findByActiveTrue();
}
