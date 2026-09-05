package com.ecom.analytics.config;

import com.ecom.common.event.KafkaTopics;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.Consumed;
import org.apache.kafka.streams.kstream.Grouped;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.Materialized;
import org.apache.kafka.streams.kstream.TimeWindows;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafkaStreams;
import org.springframework.kafka.config.KafkaStreamsConfiguration;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import static org.apache.kafka.streams.StreamsConfig.*;

/**
 * L4: Kafka Streams — windowed purchase count per product from USER_EVENT.
 * Disabled by default; enable with spring.kafka.streams.auto-startup=true + bootstrap-servers.
 * Production: Avro + Schema Registry (see L04 doc).
 */
@Configuration
@EnableKafkaStreams
public class StreamsConfig {

    @Value("${spring.kafka.bootstrap-servers:localhost:9092}")
    private String bootstrapServers;

    @Bean(name = "defaultKafkaStreamsConfig")
    public KafkaStreamsConfiguration kafkaStreamsConfig() {
        Map<String, Object> props = new HashMap<>();
        props.put(APPLICATION_ID_CONFIG, "analytics-streams");
        props.put(BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());
        props.put(DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass().getName());
        return new KafkaStreamsConfiguration(props);
    }

    @Bean
    public KStream<String, String> productPurchaseCounts(StreamsBuilder builder) {
        KStream<String, String> events = builder.stream(
                KafkaTopics.USER_EVENT, Consumed.with(Serdes.String(), Serdes.String()));

        events.filter((k, v) -> v != null && v.contains("PURCHASE"))
                .groupBy((k, v) -> extractProductId(v), Grouped.with(Serdes.String(), Serdes.String()))
                .windowedBy(TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(5)))
                .count(Materialized.as("product-purchase-counts"))
                .toStream()
                .selectKey((wk, v) -> wk.key() + "@" + wk.window().start())
                .mapValues(String::valueOf)
                .to(KafkaTopics.PRODUCT_STATS);

        return events;
    }

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private static String extractProductId(String json) {
        try {
            JsonNode node = MAPPER.readTree(json);
            return node.path("productId").asText("unknown");
        } catch (Exception e) {
            return "unknown";
        }
    }
}
