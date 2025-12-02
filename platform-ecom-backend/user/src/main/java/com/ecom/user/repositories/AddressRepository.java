package com.ecom.user.repositories;

import com.ecom.user.entity.Address;
import com.ecom.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AddressRepository extends JpaRepository<Address,Long> {

    @Modifying
    @Query("UPDATE Address a SET a.isDefault = false WHERE a.user.id = :userId")
    void resetDefaultAddresses(@Param("userId") Long userId);

    long countByUser(User user);
}
