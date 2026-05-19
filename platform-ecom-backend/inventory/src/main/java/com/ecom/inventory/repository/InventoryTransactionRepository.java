package com.ecom.inventory.repository;

import com.ecom.inventory.entity.InventoryTransaction;
import com.ecom.inventory.entity.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {

    Page<InventoryTransaction> findByInventoryId(Long inventoryId, Pageable pageable);

    List<InventoryTransaction> findByInventoryIdAndType(Long inventoryId, TransactionType type);

    List<InventoryTransaction> findByReferenceTypeAndReferenceId(String referenceType, String referenceId);

    boolean existsByInventoryIdAndReferenceTypeAndReferenceId(Long inventoryId, String referenceType, String referenceId);

    List<InventoryTransaction> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    void deleteByInventoryId(Long inventoryId);
}
