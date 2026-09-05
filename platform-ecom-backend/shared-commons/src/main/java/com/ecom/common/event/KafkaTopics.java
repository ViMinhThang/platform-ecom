package com.ecom.common.event;

/**
 * Central topic + group catalogue for the Kafka learning path.
 * L1 beginner: ORDER_CREATED only. L2 fan-out: same topic, 3 groups.
 * L3 saga: stock feedback topics. L4: streams output topic.
 */
public final class KafkaTopics {

    private KafkaTopics() {
    }

    public static final String ORDER_CREATED = "order-created-topic";
    public static final String STOCK_UPDATED = "stock-updated-topic";
    public static final String LOW_STOCK_ALERT = "low-stock-alert-topic";
    public static final String OUT_OF_STOCK = "out-of-stock-topic";
    public static final String USER_EVENT = "user-event-topic";

    // L4 streams output
    public static final String PRODUCT_STATS = "product-stats-topic";

    // DLT suffix convention: <topic>-dlt
    public static String dlt(String topic) {
        return topic + "-dlt";
    }

    public static final String GROUP_INVENTORY = "inventory-service";
    public static final String GROUP_NOTIFICATION = "notification-group";
    public static final String GROUP_ANALYTICS = "analytics-group";
    public static final String GROUP_ORDER = "order-service";
    // L08: orchestrator must NOT share GROUP_ORDER — same topic, but a
    // separate group so cart-cleanup and saga tracking consume independently.
    public static final String GROUP_ORDER_SAGA = "order-saga";
}
