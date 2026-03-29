package com.ecom.user.service.impl;

import com.ecom.common.exception.APIException;
import com.ecom.common.util.APIResponse;
import com.ecom.user.dto.NotificationEmailRequest;
import com.ecom.user.dtos.request.ForgotPasswordRequest;
import com.ecom.user.dtos.request.VerifyOtpRequest;
import com.ecom.user.dtos.response.OtpResponse;
import com.ecom.user.entity.OtpCode;
import com.ecom.user.entity.User;
import com.ecom.user.repositories.OtpCodeRepository;
import com.ecom.user.repositories.UserRepository;
import com.ecom.user.service.signature.ForgotPasswordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Random;
import java.util.concurrent.atomic.AtomicReference;

@Slf4j
@Service
@RequiredArgsConstructor
public class ForgotPasswordServiceImpl implements ForgotPasswordService {

    private final UserRepository userRepository;
    private final OtpCodeRepository otpCodeRepository;
    private final PasswordEncoder passwordEncoder;
    private final RestTemplate restTemplate;

    @Value("${app.notification.service.url:http://localhost:8080}")
    private String notificationServiceUrl;

    @Value("${app.otp.expiry-minutes:10}")
    private int otpExpiryMinutes;

    private static final String OTP_EMAIL_SUBJECT = "Password Reset OTP - Platform Ecom";
    private static final String OTP_EMAIL_TEMPLATE = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p style="color: #666; font-size: 16px;">Hello,</p>
                    <p style="color: #666; font-size: 16px;">We received a request to reset your password. Use the following OTP to verify your identity:</p>
                    <div style="background-color: #fff; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4F46E5;">%s</span>
                    </div>
                    <p style="color: #666; font-size: 14px;">This OTP will expire in %d minutes.</p>
                    <p style="color: #666; font-size: 14px;">If you did not request this password reset, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px;">This is an automated message from Platform Ecom. Please do not reply to this email.</p>
                </div>
            </body>
            </html>
            """;

    @Override
    @Transactional
    public OtpResponse generateOtp(ForgotPasswordRequest request) {
        String email = request.getEmail();
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "User not found with email: " + email));

        otpCodeRepository.markAllAsUsedByUser(user);

        String otpCode = generateOtpCode();
        Instant expiresAt = Instant.now().plusSeconds(otpExpiryMinutes * 60L);
        
        OtpCode otp = new OtpCode(user, otpCode, expiresAt);
        otpCodeRepository.save(otp);

        sendOtpEmail(email, otpCode);

        log.info("Generated OTP for user: {}", email);
        
        return new OtpResponse(
                "OTP sent to your email successfully",
                maskEmail(email),
                otpExpiryMinutes * 60L
        );
    }

    @Override
    @Transactional
    public OtpResponse verifyOtpAndResetPassword(VerifyOtpRequest request) {
        String email = request.getEmail();
        String otpCode = request.getOtpCode();
        String newPassword = request.getNewPassword();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new APIException(HttpStatus.NOT_FOUND, "User not found with email: " + email));

        AtomicReference<OtpCode> validOtp = new AtomicReference<>();
        otpCodeRepository.findByUserAndOtpCodeAndIsUsedFalse(user, otpCode)
                .ifPresent(otp -> {
                    if (!otp.isExpired()) {
                        validOtp.set(otp);
                    }
                });

        OtpCode otp = validOtp.get();
        if (otp == null) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Xác thực thất bại. Vui lòng thử lại");
        }

        otp.setIsUsed(true);
        otpCodeRepository.save(otp);

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        log.info("Password reset successfully for user: {}", email);

        return new OtpResponse(
                "Password reset successfully",
                maskEmail(email),
                null
        );
    }

    private String generateOtpCode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }

    private void sendOtpEmail(String email, String otpCode) {
        try {
            String body = String.format(OTP_EMAIL_TEMPLATE, otpCode, otpExpiryMinutes);
            NotificationEmailRequest emailRequest = new NotificationEmailRequest(
                    email,
                    OTP_EMAIL_SUBJECT,
                    body
            );
            String url = notificationServiceUrl + "/api/v1/notifications/send-email";
            restTemplate.postForObject(url, emailRequest, APIResponse.class);
            log.info("OTP email sent successfully to: {}", maskEmail(email));
        } catch (Exception e) {
            log.error("Failed to send OTP email to: {}", maskEmail(email), e);
        }
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return email;
        }
        String[] parts = email.split("@");
        String localPart = parts[0];
        String domain = parts[1];
        
        if (localPart.length() <= 2) {
            return "*".repeat(localPart.length()) + "@" + domain;
        }
        return localPart.charAt(0) + "*".repeat(localPart.length() - 2) + localPart.charAt(localPart.length() - 1) + "@" + domain;
    }
}
