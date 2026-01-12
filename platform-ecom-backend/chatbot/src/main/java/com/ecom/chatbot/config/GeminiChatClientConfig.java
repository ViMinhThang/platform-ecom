package com.ecom.chatbot.config;

import com.ecom.chatbot.tools.EmbeddingManagementTools;
import com.ecom.chatbot.tools.ProductTools;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GeminiChatClientConfig {

    @Bean
    public ChatMemory chatMemory() {
        return MessageWindowChatMemory.builder().build();
    }

    @Bean
    public ChatClient chatClient(ChatClient.Builder builder,
            ProductTools productTools,
            EmbeddingManagementTools managementTools) {
        return builder
                .defaultTools(productTools, managementTools)
                .build();
    }
}
