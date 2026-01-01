package com.ecom.chatbot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response wrapper for paginated product lists from Product service.
 * Matches the actual API response structure with 'content' field.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    // Product service returns 'content' not 'products'
    private List<ProductDTO> content;
    private Integer pageNumber;
    private Integer pageSize;
    private Long totalElements;
    private Integer totalPages;
    private Boolean lastPage;

    /**
     * Convenience method to get products (alias for content)
     */
    public List<ProductDTO> getProducts() {
        return content;
    }
}
