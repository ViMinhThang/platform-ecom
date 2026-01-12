package com.ecom.chatbot.service.signature;

import com.ecom.chatbot.dto.ProductDTO;
import com.ecom.chatbot.dto.ProductSummaryDTO;

import java.util.List;

public interface EmbeddingService {

    void syncProductEmbeddings();

    List<ProductSummaryDTO> findSimilarProducts(String query, int limit);

    void updateProductEmbedding(ProductDTO product);

    long getEmbeddingCount();

    boolean hasEmbedding(Long productId);

    String generateQueryVector(String query);
}
