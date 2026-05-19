package com.ecom.analytics.service.impl;

import com.ecom.analytics.dto.UserProfileDTO;
import com.ecom.analytics.entity.UserProfile;
import com.ecom.analytics.repository.UserProfileRepository;
import com.ecom.analytics.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final ModelMapper modelMapper;

    public UserProfileServiceImpl(UserProfileRepository userProfileRepository, ModelMapper modelMapper) {
        this.userProfileRepository = userProfileRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public UserProfileDTO getUserProfile(Long userId) {
        UserProfile profile = userProfileRepository.findById(userId)
                .orElseGet(() -> createDefaultProfile(userId));
        return modelMapper.map(profile, UserProfileDTO.class);
    }

    @Override
    public void updateUserProfile(Long userId) {
        // Complex logic to update scores based on recent events
        // This will be triggered by scheduled tasks or events
    }

    private UserProfile createDefaultProfile(Long userId) {
        UserProfile profile = new UserProfile();
        profile.setUserId(userId);
        return userProfileRepository.save(profile);
    }
}
