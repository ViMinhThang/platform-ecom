package com.ecom.user.service.signature;

import com.ecom.user.dtos.request.ForgotPasswordRequest;
import com.ecom.user.dtos.request.VerifyOtpRequest;
import com.ecom.user.dtos.response.OtpResponse;

public interface ForgotPasswordService {
    OtpResponse generateOtp(ForgotPasswordRequest request);
    OtpResponse verifyOtpAndResetPassword(VerifyOtpRequest request);
}
