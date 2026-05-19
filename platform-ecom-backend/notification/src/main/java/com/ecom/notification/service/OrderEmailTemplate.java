package com.ecom.notification.service;

import com.ecom.common.event.OrderCreatedEvent;
import com.ecom.notification.dto.UserDTO;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;

final class OrderEmailTemplate {

    private static final DateTimeFormatter DATE_FORMAT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    private static final DecimalFormat MONEY_FORMAT = new DecimalFormat("#,##0.##");

    private OrderEmailTemplate() {
    }

    static String buildOrderConfirmationHtml(
            String brandName,
            String webBaseUrl,
            UserDTO user,
            OrderCreatedEvent event
    ) {
        String safeBrand = defaultIfBlank(brandName, "Platform Ecom");
        String customerName = user != null ? defaultIfBlank(user.getName(), "there") : "there";
        String orderNumber = event != null ? defaultIfBlank(event.getOrderNumber(), "N/A") : "N/A";
        String orderDate = event != null && event.getCreatedAt() != null
                ? event.getCreatedAt().format(DATE_FORMAT)
                : "N/A";
        List<OrderCreatedEvent.OrderItemEvent> items = event != null && event.getItems() != null
                ? event.getItems()
                : Collections.emptyList();
        String orderLink = buildOrderLink(webBaseUrl, event);

        StringBuilder rows = new StringBuilder();
        BigDecimal total = BigDecimal.ZERO;

        if (items.isEmpty()) {
            rows.append("<tr>")
                    .append("<td style='padding:12px 0; color:#6b7280;' colspan='4'>No items found.</td>")
                    .append("</tr>");
        } else {
            for (OrderCreatedEvent.OrderItemEvent item : items) {
                String productName = escapeHtml(defaultIfBlank(item.getProductName(), "Unnamed item"));
                int quantity = item.getQuantity() != null ? item.getQuantity() : 0;
                BigDecimal price = item.getPrice() != null ? item.getPrice() : BigDecimal.ZERO;
                BigDecimal lineTotal = price.multiply(BigDecimal.valueOf(quantity));
                total = total.add(lineTotal);

                rows.append("<tr style='border-bottom:1px solid #eef2f7;'>")
                        .append("<td style='padding:12px 0;'>").append(productName).append("</td>")
                        .append("<td style='padding:12px 0; text-align:center;'>").append(quantity).append("</td>")
                        .append("<td style='padding:12px 0; text-align:right;'>")
                        .append(formatMoney(price)).append(" VND</td>")
                        .append("<td style='padding:12px 0; text-align:right; font-weight:600;'>")
                        .append(formatMoney(lineTotal)).append(" VND</td>")
                        .append("</tr>");
            }
        }

        StringBuilder html = new StringBuilder();
        html.append("<div style='background:#f5f7fb; padding:24px;'>")
                .append("<div style='max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb;")
                .append(" border-radius:12px; overflow:hidden;'>")
                .append("<div style='background:#0f766e; color:#ffffff; padding:20px 24px;'>")
                .append("<div style='font-size:18px; font-weight:700; letter-spacing:0.4px;'>")
                .append(escapeHtml(safeBrand))
                .append("</div>")
                .append("<div style='font-size:13px; opacity:0.9;'>Order confirmation</div>")
                .append("</div>")
                .append("<div style='padding:24px;'>")
                .append("<p style='margin:0 0 8px 0;'>Hi ").append(escapeHtml(customerName)).append(",</p>")
                .append("<p style='margin:0 0 16px 0;'>Thanks for your order. We are preparing it now.</p>")
                .append("<div style='background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px;")
                .append(" padding:16px; margin:16px 0;'>")
                .append("<table style='width:100%; font-size:13px;'>")
                .append("<tr><td style='color:#6b7280; width:120px;'>Order number</td>")
                .append("<td style='font-weight:600;'>#").append(escapeHtml(orderNumber)).append("</td></tr>")
                .append("<tr><td style='color:#6b7280;'>Placed at</td><td>")
                .append(escapeHtml(orderDate)).append("</td></tr>")
                .append("</table>")
                .append("</div>")
                .append("<table style='width:100%; border-collapse:collapse; font-size:13px;'>")
                .append("<thead>")
                .append("<tr style='text-align:left; color:#6b7280; border-bottom:2px solid #eef2f7;'>")
                .append("<th style='padding:8px 0; font-weight:600;'>Item</th>")
                .append("<th style='padding:8px 0; text-align:center; font-weight:600;'>Qty</th>")
                .append("<th style='padding:8px 0; text-align:right; font-weight:600;'>Unit price</th>")
                .append("<th style='padding:8px 0; text-align:right; font-weight:600;'>Subtotal</th>")
                .append("</tr>")
                .append("</thead>")
                .append("<tbody>")
                .append(rows)
                .append("</tbody>")
                .append("</table>")
                .append("<div style='text-align:right; margin-top:16px;'>")
                .append("<div style='color:#6b7280; font-size:12px;'>Total</div>")
                .append("<div style='font-size:20px; font-weight:700; color:#0f766e;'>")
                .append(formatMoney(total)).append(" VND</div>")
                .append("</div>");

        if (orderLink != null) {
            html.append("<div style='margin-top:20px;'>")
                    .append("<a href='").append(escapeHtml(orderLink)).append("'")
                    .append(" style='display:inline-block; padding:12px 18px; background:#0f766e;")
                    .append(" color:#ffffff; text-decoration:none; border-radius:6px; font-weight:600;'>")
                    .append("View order details</a>")
                    .append("</div>");
        }

        html.append("<p style='margin-top:24px; font-size:12px; color:#6b7280;'>")
                .append("If you have any questions, reply to this email and our team will help.")
                .append("</p>")
                .append("</div>")
                .append("</div>")
                .append("</div>");

        return html.toString();
    }

    private static String buildOrderLink(String baseUrl, OrderCreatedEvent event) {
        if (baseUrl == null || baseUrl.isBlank() || event == null || event.getOrderId() == null) {
            return null;
        }
        String normalized = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        return normalized + "/orders/" + event.getOrderId();
    }

    private static String formatMoney(BigDecimal amount) {
        if (amount == null) {
            return "0";
        }
        return MONEY_FORMAT.format(amount);
    }

    private static String escapeHtml(String value) {
        if (value == null) {
            return "";
        }
        return value.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }

    private static String defaultIfBlank(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
