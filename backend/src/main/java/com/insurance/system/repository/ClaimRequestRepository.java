package com.insurance.system.repository;

import com.insurance.system.model.ClaimRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClaimRequestRepository extends JpaRepository<ClaimRequest, Long> {
    List<ClaimRequest> findByPolicyPurchaseUserId(Long userId);
}
