package com.ecom.common.util;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Standard pagination request DTO.
 * Reduces parameter clutter in controller methods.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaginationRequest {
    private Integer pageNumber = 0;
    private Integer pageSize = 10;
    private String sortBy = "id";
    private String sortOrder = "asc";

    /**
     * Get sort direction as Spring Sort.Direction
     */
    public org.springframework.data.domain.Sort.Direction getSortDirection() {
        return sortOrder.equalsIgnoreCase("desc")
                ? org.springframework.data.domain.Sort.Direction.DESC
                : org.springframework.data.domain.Sort.Direction.ASC;
    }
}
