package com.ecom.order.repository;

import com.ecom.order.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findByUserId(Long userId);

    Optional<Cart> findBySessionId(String sessionId);

    @Query("SELECT c FROM Cart c " +
            "LEFT JOIN FETCH c.items " +
            "WHERE c.userId = :userId")
    Optional<Cart> findByUserIdWithItems(@Param("userId") Long userId);

    @Query("SELECT c FROM Cart c " +
            "WHERE c.expiresAt IS NOT NULL " +
            "AND c.expiresAt < :now")
    List<Cart> findExpiredCarts(@Param("now") LocalDateTime now);

    void deleteByUserId(Long userId);
}
