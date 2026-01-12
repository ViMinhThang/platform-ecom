package com.ecom.chatbot.service.impl;

import com.ecom.chatbot.dto.*;
import com.ecom.chatbot.service.signature.ChatbotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatbotServiceImpl implements ChatbotService {

    private final ChatClient chatClient;
    private final ChatMemory chatMemory;

    private static final String DEFAULT_SYSTEM_PROMPT = """
            Bạn là trợ lý mua sắm thông minh cho nền tảng thương mại điện tử ACME (ACME E-commerce).

            Nhiệm vụ của bạn:
            1. Giúp người dùng tìm kiếm sản phẩm phù hợp dựa trên các yêu cầu về tên, loại, giá cả, thương hiệu.
            2. Cung cấp thông tin chi tiết về sản phẩm khi được hỏi.
            3. Tư vấn mua sắm một cách lịch sự, hữu ích và ngắn gọn.

            Quy tắc quan trọng:
            - Luôn trả lời bằng tiếng Việt.
            - Sử dụng các công cụ (tools) được cung cấp để truy vấn dữ liệu sản phẩm thực tế.
            - Nếu KHÔNG tìm thấy sản phẩm nào phù hợp với yêu cầu cụ thể (ví dụ: thương hiệu hoặc khoảng giá nhất định), hãy trả lời lịch sự rằng không tìm thấy sản phẩm phù hợp.
            - KHÔNG gợi ý sản phẩm thay thế hoặc cách tìm kiếm khác nếu người dùng đã đưa ra yêu cầu cụ thể mà không có kết quả.
            - Trình bày thông tin sản phẩm một cách dễ nhìn (sử dụng danh sách hoặc bảng nếu cần).
            """;

    @Override
    public ChatResponseDTO chat(ChatRequestDTO request) {
        long startTime = System.currentTimeMillis();
        log.info("Processing chat request with ChatClient: '{}'", request.getMessage());

        try {
            String conversationId = (request.getConversationId() != null && !request.getConversationId().isBlank())
                    ? request.getConversationId()
                    : UUID.randomUUID().toString();

            // Gemini will automatically choose which tool to call
            String aiResponse = chatClient.prompt()
                    .advisors(MessageChatMemoryAdvisor.builder(chatMemory).build())
                    .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, conversationId))
                    .system(DEFAULT_SYSTEM_PROMPT)
                    .user(request.getMessage())
                    .call()
                    .content();

            long processingTime = System.currentTimeMillis() - startTime;
            log.info("Chat request processed in {}ms", processingTime);

            return ChatResponseDTO.builder()
                    .message(aiResponse)
                    .products(List.of()) // Products are now described in the text response or handled by frontend
                    .timestamp(LocalDateTime.now())
                    .processingTimeMs(processingTime)
                    .build();

        } catch (Exception e) {
            log.error("Error processing chat request: {}", e.getMessage(), e);

            return ChatResponseDTO.builder()
                    .message("Xin lỗi, tôi gặp lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.")
                    .products(List.of())
                    .timestamp(LocalDateTime.now())
                    .processingTimeMs(System.currentTimeMillis() - startTime)
                    .build();
        }
    }

    @Override
    public ChatResponseDTO getProductSummary(String slug) {
        long startTime = System.currentTimeMillis();
        log.info("Getting product summary for slug: {}", slug);

        try {
            String aiResponse = chatClient.prompt()
                    .system(DEFAULT_SYSTEM_PROMPT)
                    .user("Hãy giới thiệu chi tiết về sản phẩm có slug: " + slug)
                    .call()
                    .content();

            return ChatResponseDTO.builder()
                    .message(aiResponse)
                    .products(List.of())
                    .timestamp(LocalDateTime.now())
                    .processingTimeMs(System.currentTimeMillis() - startTime)
                    .build();

        } catch (Exception e) {
            log.error("Error getting product summary: {}", e.getMessage(), e);
            return ChatResponseDTO.builder()
                    .message("Xin lỗi, tôi không thể lấy thông tin chi tiết cho sản phẩm này.")
                    .products(List.of())
                    .timestamp(LocalDateTime.now())
                    .processingTimeMs(System.currentTimeMillis() - startTime)
                    .build();
        }
    }
}
