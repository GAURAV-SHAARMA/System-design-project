package com.insurance.system.repository;

import com.insurance.system.model.PolicyPurchase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PolicyPurchaseRepository extends JpaRepository<PolicyPurchase, Long> {
    List<PolicyPurchase> findByUserId(Long userId);
}
