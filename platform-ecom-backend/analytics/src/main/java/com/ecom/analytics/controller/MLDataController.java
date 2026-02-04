package com.ecom.analytics.controller;

import com.ecom.analytics.dto.MLInteractionsResponse;
import com.ecom.analytics.service.MLDataService;
import com.ecom.common.util.APIResponse;
import com.ecom.common.util.ResponseBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/analytics/ml")
@RequiredArgsConstructor
public class MLDataController {

    private final MLDataService mlDataService;

    @GetMapping("/interactions")
    public ResponseEntity<APIResponse<MLInteractionsResponse>> getInteractions(
            @RequestParam(defaultValue = "90") Integer days) {
        MLInteractionsResponse response = mlDataService.getUserProductInteractions(days);
        return ResponseBuilder.success("Interactions retrieved successfully", response);
    }
}
