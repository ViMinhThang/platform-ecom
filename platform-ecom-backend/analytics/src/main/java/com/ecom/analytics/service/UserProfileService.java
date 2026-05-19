package com.ecom.analytics.service;

import com.ecom.analytics.dto.UserProfileDTO;

public interface UserProfileService {
    UserProfileDTO getUserProfile(Long userId);
    void updateUserProfile(Long userId);
}
