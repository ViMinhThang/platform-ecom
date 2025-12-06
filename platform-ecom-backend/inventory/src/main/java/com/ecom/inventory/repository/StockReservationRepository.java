package com.ecom.inventory.repository;

import com.ecom.inventory.entity.ReservationStatus;
import com.ecom.inventory.entity.StockReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface StockReservationRepository extends JpaRepository<StockReservation, Long> {

    List<StockReservation> findByCartIdAndStatus(Long cartId, ReservationStatus status);

    List<StockReservation> findByUserIdAndStatus(Long userId, ReservationStatus status);

    Optional<StockReservation> findByInventoryIdAndCartIdAndStatus(
            Long inventoryId, Long cartId, ReservationStatus status);

    /**
     * Find expired reservations that need to be released
     */
    @Query("SELECT r FROM StockReservation r WHERE r.status = 'PENDING' AND r.expiresAt < :now")
    List<StockReservation> findExpiredReservations(@Param("now") LocalDateTime now);

    /**
     * Sum of pending reservations for an inventory item
     */
    @Query("SELECT COALESCE(SUM(r.quantity), 0) FROM StockReservation r " +
            "WHERE r.inventory.id = :inventoryId AND r.status = 'PENDING'")
    Integer getTotalReservedQuantity(@Param("inventoryId") Long inventoryId);
}
