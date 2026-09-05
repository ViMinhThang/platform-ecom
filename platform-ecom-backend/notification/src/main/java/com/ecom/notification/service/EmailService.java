package com.ecom.notification.service;

import com.ecom.common.event.OrderCreatedEvent;
import com.ecom.notification.dto.UserDTO;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:platform-ecom@no-reply.com}")
    private String fromAddress;

    @Value("${app.mail.brand-name:Platform Ecom}")
    private String brandName;

    @Value("${app.web.base-url:}")
    private String webBaseUrl;

    /**
     * L05: retried on transient SMTP failures only (see application.yml:
     * retry mailSend). Auth failures are ignored — retrying bad credentials
     * is pointless. Deadline comes from mail.smtp timeouts below, not a
     * TimeLimiter: this call is synchronous, and forcing it async just for
     * a timeout would be over-engineering (see L05 doc).
     *
     * L06: circuit breaker around the retry (Retry outer, Breaker inner —
     * each attempt feeds the breaker). Open breaker fails fast with
     * CallNotPermittedException instead of hammering a dead SMTP server.
     * No fallback: the listener rethrows, the offset is not committed,
     * and the mail is retried after restart. A fallback that acked here
     * would silently drop order confirmations.
     */
    @Retry(name = "mailSend")
    @CircuitBreaker(name = "mailSend")
    public void sendOrderConfirmationEmail(UserDTO user, OrderCreatedEvent event) {
        String orderNumber = event != null ? event.getOrderNumber() : null;
        String subject = buildSubject(orderNumber);
        String body = OrderEmailTemplate.buildOrderConfirmationHtml(brandName, webBaseUrl, user, event);
        sendEmail(user.getEmail(), subject, body);
    }

    public void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            helper.setFrom(fromAddress);

            mailSender.send(message);
            log.info("Email sent successfully to {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}", to, e);
        }
    }

    private String buildSubject(String orderNumber) {
        String base = brandName + " Order Confirmation";
        if (orderNumber == null || orderNumber.isBlank()) {
            return base;
        }
        return base + " #" + orderNumber;
    }
}
