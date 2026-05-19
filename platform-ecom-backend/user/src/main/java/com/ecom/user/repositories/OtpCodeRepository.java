package com.ecom.user.repositories;

import com.ecom.user.entity.OtpCode;
import com.ecom.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OtpCodeRepository extends JpaRepository<OtpCode, Long> {

    Optional<OtpCode> findByUserAndOtpCodeAndIsUsedFalse(User user, String otpCode);

    List<OtpCode> findByUserAndIsUsedFalse(User user);

    @Modifying
    @Query("UPDATE OtpCode o SET o.isUsed = true WHERE o.user = :user AND o.isUsed = false")
    void markAllAsUsedByUser(@Param("user") User user);
}
