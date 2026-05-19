package com.ecom.user.service.signature;

import com.ecom.user.dtos.request.UpdateUserRequest;
import com.ecom.user.dtos.response.UserInfoResponse;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    public UserInfoResponse getMyProfile(Long userId);

    public UserInfoResponse updateMyProfile(Long userId, UpdateUserRequest request);

    public String uploadMyAvatar(Long userId, MultipartFile image);
}
