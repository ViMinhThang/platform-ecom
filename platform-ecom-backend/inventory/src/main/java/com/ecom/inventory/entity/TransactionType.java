package com.ecom.inventory.entity;

/**
 * Types of inventory transactions for audit trail.
 */
public enum TransactionType {
    SALE,           // Stock decreased due to order
    ADJUSTMENT,     // Manual stock adjustment
    RESERVATION,    // Stock reserved for checkout
    RELEASE,        // Reserved stock released (expired/cancelled)
    PURCHASE,       // Stock increased from supplier
    RETURN,         // Stock returned from customer
    INITIAL         // Initial stock from migration
}
