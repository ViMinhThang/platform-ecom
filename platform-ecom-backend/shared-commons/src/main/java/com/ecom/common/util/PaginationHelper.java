package com.ecom.common.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

/**
 * Utility class for creating pagination objects.
 */
public class PaginationHelper {

    private PaginationHelper() {
        // Utility class - prevent instantiation
    }

    /**
     * Create a Pageable from pagination request parameters.
     */
    public static Pageable createPageable(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort.Direction direction = sortOrder.equalsIgnoreCase("desc")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        return PageRequest.of(pageNumber, pageSize, Sort.by(direction, sortBy));
    }

    /**
     * Create a Pageable from PaginationRequest DTO.
     */
    public static Pageable createPageable(PaginationRequest request) {
        return createPageable(
                request.getPageNumber(),
                request.getPageSize(),
                request.getSortBy(),
                request.getSortOrder());
    }
}
