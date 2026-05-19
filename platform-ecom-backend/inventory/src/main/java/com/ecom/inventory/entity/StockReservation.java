package com.ecom.inventory.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Temporary stock holds during checkout process.
 */
@Entity
@Table(name = "stock_reservations", indexes = {
        @Index(name = "idx_reservation_inventory", columnList = "inventory_id"),
        @Index(name = "idx_reservation_status", columnList = "status"),
        @Index(name = "idx_reservation_expires", columnList = "expires_at"),
        @Index(name = "idx_reservation_cart", columnList = "cart_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_id", nullable = false)
    @ToString.Exclude
    private Inventory inventory;

    @Column(name = "cart_id")
    private Long cartId;

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false)
    private Integer quantity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ReservationStatus status = ReservationStatus.PENDING;

    @Column(name = "reserved_at")
    private LocalDateTime reservedAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @PrePersist
    protected void onCreate() {
        reservedAt = LocalDateTime.now();
        if (expiresAt == null) {
            expiresAt = reservedAt.plusMinutes(15); // Default 15-minute hold
        }
    }

    public boolean isExpired() {
        return status == ReservationStatus.PENDING 
                && LocalDateTime.now().isAfter(expiresAt);
    }

    public void confirm() {
        this.status = ReservationStatus.CONFIRMED;
        this.confirmedAt = LocalDateTime.now();
    }

    public void cancel() {
        this.status = ReservationStatus.CANCELLED;
        this.cancelledAt = LocalDateTime.now();
    }

    public void expire() {
        this.status = ReservationStatus.EXPIRED;
        this.cancelledAt = LocalDateTime.now();
    }
}
