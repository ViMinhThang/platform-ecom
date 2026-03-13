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
    public Consumer<OrderCreatedEvent> orderCreatedConsumerBinding() {
        return event -> {
            log.info("Received OrderCreatedEvent for order: {}", event.getOrderNumber());
            
            try {
                // Fetch user email
                APIResponse<UserDTO> userResponse = userServiceClient.getUser(event.getUserId());
                
                if (userResponse != null && userResponse.isSuccess() && userResponse.getData() != null) {
                    String email = userResponse.getData().getEmail();
                    String name = userResponse.getData().getName();
                    
                    String subject = "Xác nhận đơn hàng #" + event.getOrderNumber();
                    String body = buildOrderEmailBody(name, event);
                    
                    emailService.sendEmail(email, subject, body);
                } else {
                    log.error("Could not fetch user info for userId: {}. Email notification skipped.", event.getUserId());
                }
            } catch (Exception e) {
                log.error("Error processing OrderCreatedEvent for order: {}", event.getOrderNumber(), e);
            }
        };
    }

    private String buildOrderEmailBody(String userName, OrderCreatedEvent event) {
        StringBuilder sb = new StringBuilder();
        sb.append("<div style='font-family: sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 5px;'>");
        sb.append("<h2 style='color: #009688;'>Chào ").append(userName).append(",</h2>");
        sb.append("<p>Cảm ơn bạn đã đặt hàng tại <strong>Platform Ecom</strong>. Đơn hàng của bạn đã được xác nhận thành công!</p>");
        
        sb.append("<div style='background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;'>");
        sb.append("<h3 style='margin-top: 0;'>Thông tin đơn hàng</h3>");
        sb.append("<p><strong>Mã đơn hàng:</strong> #").append(event.getOrderNumber()).append("</p>");
        sb.append("<p><strong>Ngày đặt:</strong> ").append(event.getCreatedAt()).append("</p>");
        sb.append("</div>");
        
        sb.append("<h3>Chi tiết sản phẩm</h3>");
        sb.append("<table style='width: 100%; border-collapse: collapse;'>");
        sb.append("<thead><tr style='border-bottom: 2px solid #eee;'>");
        sb.append("<th style='text-align: left; padding: 10px;'>Sản phẩm</th>");
        sb.append("<th style='text-align: center; padding: 10px;'>Số lượng</th>");
        sb.append("<th style='text-align: right; padding: 10px;'>Giá</th>");
        sb.append("</tr></thead><tbody>");
        
        java.math.BigDecimal total = java.math.BigDecimal.ZERO;
        for (OrderCreatedEvent.OrderItemEvent item : event.getItems()) {
            sb.append("<tr style='border-bottom: 1px solid #eee;'>");
            sb.append("<td style='padding: 10px;'>").append(item.getProductName()).append("</td>");
            sb.append("<td style='padding: 10px; text-align: center;'>").append(item.getQuantity()).append("</td>");
            sb.append("<td style='padding: 10px; text-align: right;'>").append(item.getPrice()).append(" VND</td>");
            sb.append("</tr>");
            total = total.add(item.getPrice().multiply(java.math.BigDecimal.valueOf(item.getQuantity())));
        }
        
        sb.append("</tbody></table>");
        
        sb.append("<div style='text-align: right; margin-top: 20px;'>");
        sb.append("<h3 style='color: #009688;'>Tổng cộng: ").append(total).append(" VND</h3>");
        sb.append("</div>");
        
        sb.append("<p style='margin-top: 30px; font-size: 0.9em; color: #777;'>");
        sb.append("Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.");
        sb.append("</p>");
        sb.append("</div>");
        
        return sb.toString();
    }
}
