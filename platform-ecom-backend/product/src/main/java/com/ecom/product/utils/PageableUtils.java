package com.ecom.product.utils;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

/**
 * Utility class for creating Pageable instances.
 * Extracted to eliminate duplicate code across service classes.
 */
public class PageableUtils {
    
    private static final String ASCENDING_ORDER = "asc";

    private PageableUtils() {
        // Private constructor to prevent instantiation
    }

    /**
     * Creates a Pageable object with the specified pagination and sorting parameters.
     *
     * @param page      The page number (0-indexed)
     * @param perPage   The number of items per page
     * @param sortBy    The field to sort by
     * @param sortOrder The sort order ("asc" or "desc")
     * @return A configured Pageable instance
     */
    public static Pageable createPageable(Integer page, Integer perPage, 
                                         String sortBy, String sortOrder) {
        Sort sort = ASCENDING_ORDER.equalsIgnoreCase(sortOrder) 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        return PageRequest.of(page, perPage, sort);
    }
}
