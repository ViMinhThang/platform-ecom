package com.ecom.chatbot.service.signature;

import com.ecom.chatbot.dto.ProductSummaryDTO;

import java.util.List;

public interface GeminiService {

    String generateProductSummary(List<ProductSummaryDTO> products, String userQuery);

    float[] generateQueryEmbedding(String text);

    float[] generateDocumentEmbedding(String text);

    int getEmbeddingDimensions();
}
