package com.ecom.analytics.config;

import com.ecom.common.event.KafkaTopics;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

/**
 * L2-L4: analytics consumes ORDER_CREATED, produces USER_EVENT.
 */
@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic orderCreatedTopic() {
        return TopicBuilder.name(KafkaTopics.ORDER_CREATED).partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic userEventTopic() {
        return TopicBuilder.name(KafkaTopics.USER_EVENT).partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic productStatsTopic() {
        return TopicBuilder.name(KafkaTopics.PRODUCT_STATS).partitions(3).replicas(1).build();
    }
}
