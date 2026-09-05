package com.ecom.order.config;

import com.ecom.common.event.KafkaTopics;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

/**
 * L1: explicit topics replace the old Stream bindings.
 * Ownership: order owns ORDER_CREATED; inventory owns stock feedback topics.
 * Partitions: order-created=3 (key=orderId ordering lab).
 */
@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic orderCreatedTopic() {
        return TopicBuilder.name(KafkaTopics.ORDER_CREATED).partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic outOfStockDlt() {
        return TopicBuilder.name(KafkaTopics.dlt(KafkaTopics.OUT_OF_STOCK)).partitions(1).replicas(1).build();
    }
}
