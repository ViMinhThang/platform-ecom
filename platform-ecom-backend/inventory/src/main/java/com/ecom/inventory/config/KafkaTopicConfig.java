package com.ecom.inventory.config;

import com.ecom.common.event.KafkaTopics;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

/**
 * L1-L3: inventory owns the stock feedback topics + ORDER_CREATED DLT.
 * ORDER_CREATED itself is owned by order.
 */
@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic stockUpdatedTopic() {
        return TopicBuilder.name(KafkaTopics.STOCK_UPDATED).partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic lowStockAlertTopic() {
        return TopicBuilder.name(KafkaTopics.LOW_STOCK_ALERT).partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic outOfStockTopic() {
        return TopicBuilder.name(KafkaTopics.OUT_OF_STOCK).partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic orderCreatedDlt() {
        return TopicBuilder.name(KafkaTopics.dlt(KafkaTopics.ORDER_CREATED)).partitions(1).replicas(1).build();
    }
}
