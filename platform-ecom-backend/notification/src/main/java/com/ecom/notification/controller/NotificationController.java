package com.ecom.notification.controller;

import com.ecom.common.util.APIResponse;
import com.ecom.notification.dto.SendEmailRequest;
import com.ecom.notification.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final EmailService emailService;

    @PostMapping("/send-email")
    public ResponseEntity<APIResponse<Void>> sendEmail(@RequestBody SendEmailRequest request) {
        emailService.sendEmail(request.getTo(), request.getSubject(), request.getBody());
        return ResponseEntity.ok(APIResponse.success(null));
    }
}
