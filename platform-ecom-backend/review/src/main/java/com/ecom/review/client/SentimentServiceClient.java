package com.ecom.review.client;

import com.ecom.review.dto.SentimentRequest;
import com.ecom.review.dto.SentimentResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange
public interface SentimentServiceClient {

    @PostExchange("/analyze")
    ResponseEntity<SentimentResponse> analyze(@RequestBody SentimentRequest request);
}
