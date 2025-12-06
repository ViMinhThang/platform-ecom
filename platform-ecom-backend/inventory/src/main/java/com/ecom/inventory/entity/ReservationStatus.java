package com.ecom.inventory.entity;

/**
 * Status of stock reservations.
 */
public enum ReservationStatus {
    PENDING,    // Reservation active, waiting for confirmation
    CONFIRMED,  // Order confirmed, stock deducted
    EXPIRED,    // Reservation timed out
    CANCELLED   // User cancelled checkout
}
