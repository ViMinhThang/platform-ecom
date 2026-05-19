package com.ecom.chatbot.service.impl;

import com.ecom.chatbot.dto.*;
import com.ecom.chatbot.service.signature.ChatbotService;
import com.ecom.chatbot.tools.ProductTools;
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

                        QUY TẮC CHỌN TOOL (BẮT BUỘC TUÂN THỦ):
                        - Khi người dùng nhắc đến tên thương hiệu/sản phẩm cụ thể (iPhone, Samsung, Apple, Xiaomi, Sony, MacBook, iPad, AirPods, v.v.):
                          + Nếu CÓ kèm khoảng giá → Dùng tool searchWithFilters(query=tên thương hiệu, minPrice, maxPrice)
                          + Nếu KHÔNG có giá → Dùng tool searchByBrand(brand=tên thương hiệu)
                        - Khi người dùng tìm kiếm chung (ví dụ: "tìm laptop", "tai nghe bluetooth"):
                          + Nếu CÓ kèm khoảng giá → Dùng tool searchWithFilters(query=từ khóa, minPrice, maxPrice)
                          + Nếu KHÔNG có giá → Dùng tool searchProducts(query=từ khóa)
                        - Khi người dùng CHỈ nhắc đến giá mà không có sản phẩm cụ thể → Dùng tool searchByPriceRange
                        - Khi người dùng muốn "rẻ nhất", "đắt nhất", "bán chạy nhất", "đánh giá cao nhất" → Dùng tool searchAndSortProducts

                        QUY TẮC TRẢ LỜI:
                        - Luôn trả lời bằng tiếng Việt.
                        - Sử dụng các công cụ (tools) được cung cấp để truy vấn dữ liệu sản phẩm thực tế.
                        - Nếu KHÔNG tìm thấy sản phẩm nào phù hợp, hãy nói rõ ràng và gợi ý:
                          + Thử tìm kiếm với từ khóa khác.
                          + Duyệt qua các danh mục sản phẩm trên trang web.
                          + Liên hệ bộ phận hỗ trợ nếu cần giúp đỡ thêm.
                        - Trình bày thông tin sản phẩm một cách dễ nhìn (sử dụng danh sách hoặc bảng nếu cần).
                        - KHÔNG được trả lời sản phẩm không liên quan đến yêu cầu. Ví dụ: nếu hỏi "iPhone" thì KHÔNG trả về tai nghe hoặc đồng hồ trừ khi chúng là phụ kiện iPhone.
                        """;

        @Override
        public ChatResponseDTO chat(ChatRequestDTO request) {
                long startTime = System.currentTimeMillis();
                log.info("Processing chat request with ChatClient: '{}'", request.getMessage());

                try {
                        String conversationId = request.getConversationId();

                        ProductTools.clearLastFoundProducts();

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

                        List<ProductSummaryDTO> foundProducts = ProductTools.getLastFoundProducts();
                        boolean productSearchAttempted = foundProducts != null;
                        if (foundProducts == null) {
                                foundProducts = List.of();
                        }

                        boolean showSupport = productSearchAttempted && foundProducts.isEmpty();

                        return ChatResponseDTO.builder()
                                        .message(aiResponse)
                                        .products(foundProducts)
                                        .showSupportInfo(showSupport)
                                        .timestamp(LocalDateTime.now())
                                        .processingTimeMs(processingTime)
                                        .build();

                } catch (Exception e) {
                        log.error("Error processing chat request: {}", e.getMessage(), e);

                        return ChatResponseDTO.builder()
                                        .message("Xin lỗi, tôi gặp lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.")
                                        .products(List.of())
                                        .showSupportInfo(true)
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
                        ProductTools.clearLastFoundProducts();

                        String aiResponse = chatClient.prompt()
                                        .system(DEFAULT_SYSTEM_PROMPT)
                                        .user("Hãy giới thiệu chi tiết về sản phẩm có slug: " + slug)
                                        .call()
                                        .content();

                        List<ProductSummaryDTO> foundProducts = ProductTools.getLastFoundProducts();
                        if (foundProducts == null) {
                                foundProducts = List.of();
                        }

                        return ChatResponseDTO.builder()
                                        .message(aiResponse)
                                        .products(foundProducts)
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
