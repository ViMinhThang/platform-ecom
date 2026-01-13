package com.ecom.user.helper;

import com.ecom.common.exception.APIException;
import com.ecom.common.exception.ResourceNotFoundException;
import com.ecom.common.exception.UserAlreadyExistsException;
import com.ecom.user.entity.User;
import com.ecom.user.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserHelper {

    private final UserRepository userRepository;

    public User findByIdOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "UserId", userId));
    }

    public void checkEmailAndUsernameExists(String email, String username) {
        if (userRepository.existsByUserName(username)) {
            throw new UserAlreadyExistsException("Error: Username is already taken!");
        }
        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException("Error: Email is already in use");
        }
    }

    public void validateUniqueData(Long currentUserId, String newEmail, String newUsername) {
        User currentUser = findByIdOrThrow(currentUserId);

        if (!currentUser.getUserName().equals(newUsername) && userRepository.existsByUserName(newUsername)) {
            throw new APIException("Username is already taken!");
        }

        if (!currentUser.getEmail().equals(newEmail) && userRepository.existsByEmail(newEmail)) {
            throw new APIException("Email is already in use!");
        }
    }
}
