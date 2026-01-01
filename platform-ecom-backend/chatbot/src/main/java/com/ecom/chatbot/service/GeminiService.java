package com.ecom.chatbot.service;

import com.ecom.chatbot.dto.ProductSummaryDTO;
import com.google.genai.Client;
import com.google.genai.types.EmbedContentConfig;
import com.google.genai.types.EmbedContentResponse;
import com.google.genai.types.GenerateContentResponse;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service for interacting with Google Gemini AI.
 * Handles both text generation (chat) and embedding generation.
 */
@Service
@Slf4j
public class GeminiService {

    private Client client;

    @Value("${gemini.model.chat:gemini-2.5-flash}")
    private String chatModel;

    @Value("${gemini.model.embedding:gemini-embedding-001}")
    private String embeddingModel;

    @Value("${gemini.embedding.dimensions:768}")
    private int embeddingDimensions;

    @PostConstruct
    public void init() {
        // Client automatically reads GEMINI_API_KEY from environment variable
        this.client = new Client();
        log.info("Gemini client initialized with chat model: {}, embedding model: {}",
                chatModel, embeddingModel);
    }

    /**
     * Generate AI response for product query.
     *
     * @param products  List of products to include in context
     * @param userQuery User's original query
     * @return AI-generated response text
     */
    public String generateProductSummary(List<ProductSummaryDTO> products, String userQuery) {
        String prompt = buildProductPrompt(products, userQuery);

        try {
            GenerateContentResponse response = client.models.generateContent(
                    chatModel,
                    prompt,
                    null);
            return response.text();
        } catch (Exception e) {
            log.error("Error generating content with Gemini: {}", e.getMessage(), e);
            return buildFallbackResponse(products, userQuery);
        }
    }

    /**
     * Generate embedding vector for user queries.
     * Uses RETRIEVAL_QUERY task type for optimal query matching.
     *
     * @param text Text to embed
     * @return float array of embedding values
     */
    public float[] generateQueryEmbedding(String text) {
        return generateEmbedding(text, "RETRIEVAL_QUERY");
    }

    /**
     * Generate embedding vector for product documents.
     * Uses RETRIEVAL_DOCUMENT task type for optimal document indexing.
     *
     * @param text Text to embed
     * @return float array of embedding values
     */
    public float[] generateDocumentEmbedding(String text) {
        return generateEmbedding(text, "RETRIEVAL_DOCUMENT");
    }

    /**
     * Generate embedding with specified task type.
     */
    private float[] generateEmbedding(String text, String taskType) {
        try {
            EmbedContentConfig config = EmbedContentConfig.builder()
                    .taskType(taskType)
                    .outputDimensionality(embeddingDimensions)
                    .build();

            EmbedContentResponse response = client.models.embedContent(
                    embeddingModel,
                    text,
                    config);

            // embeddings() returns Optional<List<ContentEmbedding>>
            var embeddingsOptional = response.embeddings();
            if (embeddingsOptional.isPresent() && !embeddingsOptional.get().isEmpty()) {
                var firstEmbedding = embeddingsOptional.get().get(0);
                var valuesOptional = firstEmbedding.values();
                if (valuesOptional.isPresent()) {
                    List<Float> values = valuesOptional.get();
                    return toFloatArray(values);
                }
            }
            throw new RuntimeException("No embeddings returned from Gemini API");
        } catch (Exception e) {
            log.error("Error generating embedding with Gemini: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate embedding", e);
        }
    }

    /**
     * Build prompt for product summary generation.
     * Instructs the AI to respond in Vietnamese.
     */
    private String buildProductPrompt(List<ProductSummaryDTO> products, String userQuery) {
        StringBuilder sb = new StringBuilder();
        sb.append("Bạn là trợ lý mua sắm thông minh cho một nền tảng thương mại điện tử. ");
        sb.append("Dựa trên câu hỏi của người dùng và các sản phẩm được tìm thấy qua tìm kiếm ngữ nghĩa, ");
        sb.append("hãy cung cấp một tóm tắt hữu ích và đưa ra gợi ý phù hợp.\n\n");
        sb.append("**QUAN TRỌNG: Luôn trả lời bằng tiếng Việt.**\n\n");

        sb.append("## Câu hỏi của người dùng\n");
        sb.append(userQuery).append("\n\n");

        if (products != null && !products.isEmpty()) {
            sb.append("## Sản phẩm liên quan\n");
            for (int i = 0; i < products.size(); i++) {
                ProductSummaryDTO product = products.get(i);
                sb.append(String.format("%d. **%s**\n", i + 1, product.getName()));

                // Handle price - use doubleValue() to ensure proper float formatting
                double price = product.getPrice() != null ? product.getPrice().doubleValue() : 0.0;
                sb.append(String.format("   - Giá: %,.0f VNĐ\n", price));

                // Handle rating - ensure it's a double
                double rating = product.getAverageRating() != null ? product.getAverageRating() : 0.0;
                sb.append(String.format("   - Đánh giá: %.1f/5\n", rating));

                if (product.getCategoryName() != null) {
                    sb.append(String.format("   - Danh mục: %s\n", product.getCategoryName()));
                }
                if (product.getDescription() != null && !product.getDescription().isEmpty()) {
                    String desc = product.getDescription();
                    // Remove HTML tags
                    desc = desc.replaceAll("<[^>]*>", "");
                    if (desc.length() > 200) {
                        desc = desc.substring(0, 200) + "...";
                    }
                    sb.append(String.format("   - Mô tả: %s\n", desc));
                }
                if (product.getSimilarityScore() != null) {
                    sb.append(String.format("   - Độ liên quan: %.0f%%\n",
                            product.getSimilarityScore() * 100));
                }
                sb.append("\n");
            }
        } else {
            sb.append("Không tìm thấy sản phẩm phù hợp với yêu cầu.\n\n");
        }

        sb.append("## Hướng dẫn\n");
        sb.append("- Trả lời bằng tiếng Việt\n");
        sb.append("- Đưa ra phản hồi hữu ích theo nhu cầu người dùng\n");
        sb.append("- Nếu có sản phẩm, hãy nêu bật những sản phẩm phù hợp nhất\n");
        sb.append("- So sánh sản phẩm nếu cần thiết\n");
        sb.append("- Ngắn gọn nhưng đầy đủ thông tin\n");
        sb.append("- Nếu không có sản phẩm phù hợp, hãy gợi ý cách tìm kiếm khác\n");

        return sb.toString();
    }

    /**
     * Build fallback response when AI generation fails.
     * Response in Vietnamese.
     */
    private String buildFallbackResponse(List<ProductSummaryDTO> products, String userQuery) {
        if (products == null || products.isEmpty()) {
            return "Không tìm thấy sản phẩm phù hợp với yêu cầu: \"" + userQuery +
                    "\". Vui lòng thử từ khóa khác.";
        }

        StringBuilder sb = new StringBuilder();
        sb.append("Dựa trên tìm kiếm \"").append(userQuery).append("\", đây là một số sản phẩm:\n\n");

        for (ProductSummaryDTO product : products) {
            sb.append("• **").append(product.getName()).append("**");
            if (product.getPrice() != null) {
                sb.append(String.format(" - %,.0f VNĐ", product.getPrice().doubleValue()));
            }
            sb.append("\n");
        }

        return sb.toString();
    }

    /**
     * Convert List<Float> to float[].
     */
    private float[] toFloatArray(List<Float> values) {
        float[] result = new float[values.size()];
        for (int i = 0; i < values.size(); i++) {
            result[i] = values.get(i);
        }
        return result;
    }

    /**
     * Get the embedding dimensions configured.
     */
    public int getEmbeddingDimensions() {
        return embeddingDimensions;
    }
}
