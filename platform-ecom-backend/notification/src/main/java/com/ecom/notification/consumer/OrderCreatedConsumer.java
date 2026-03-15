package com.ecom.notification.consumer;

import com.ecom.common.event.OrderCreatedEvent;
import com.ecom.common.util.APIResponse;
import com.ecom.notification.client.UserServiceClient;
import com.ecom.notification.dto.UserDTO;
import com.ecom.notification.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.function.Consumer;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class OrderCreatedConsumer {

    private final EmailService emailService;
    private final UserServiceClient userServiceClient;

    @Bean
    public Consumer<OrderCreatedEvent> orderCreatedConsumer() {
        return event -> {
            log.info("Received OrderCreatedEvent for order: {}", event.getOrderNumber());

            try {
                APIResponse<UserDTO> userResponse = userServiceClient.getUser(event.getUserId());

                if (userResponse == null || !userResponse.isSuccess() || userResponse.getData() == null) {
                    log.error("Could not fetch user info for userId: {}. Email notification skipped.", event.getUserId());
                    return;
                }

                UserDTO user = userResponse.getData();
                if (user.getEmail() == null || user.getEmail().isBlank()) {
                    log.warn("User {} has no email. Order confirmation not sent.", user.getId());
                    return;
                }

                emailService.sendOrderConfirmationEmail(user, event);
            } catch (Exception e) {
                log.error("Error processing OrderCreatedEvent for order: {}", event.getOrderNumber(), e);
            }
        };
    }
}
