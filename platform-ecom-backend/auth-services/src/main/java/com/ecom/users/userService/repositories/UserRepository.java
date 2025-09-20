package com.ecom.users.userService.repositories;

import com.ecom.users.userService.Entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u.userId FROM User u WHERE u.userName = :username")
    Optional<Long> findUserIdByUserName(@Param("username") String username);

    Boolean existsByUserName(String username);

    Boolean existsByEmail(String email);

}