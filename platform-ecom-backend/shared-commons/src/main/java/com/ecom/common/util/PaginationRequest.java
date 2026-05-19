package com.ecom.common.util;

import org.springframework.data.domain.Sort.Direction;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaginationRequest {
    private Integer pageNumber = 0;
    private Integer pageSize = 10;
    private String sortBy = "id";
    private String sortOrder = "asc";

    public void setPage(Integer page) {
        this.pageNumber = page;
    }

    public void setSize(Integer size) {
        this.pageSize = size;
    }

    public Direction getSortDirection() {
        return sortOrder.equalsIgnoreCase("desc")
                ? Direction.DESC
                : Direction.ASC;
    }
}
