package com.ecom.review.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SentimentResponse {
    private String sentiment; // POSITIVE, NEUTRAL, NEGATIVE
    private Double score;     // 0.0 - 1.0

    @JsonProperty("nlp_score")
    private Double nlpScore;  // Pure NLP text sentiment score
}
