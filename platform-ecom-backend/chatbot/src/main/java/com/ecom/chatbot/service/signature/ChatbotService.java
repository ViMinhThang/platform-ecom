package com.ecom.chatbot.service.signature;

import com.ecom.chatbot.dto.ChatRequestDTO;
import com.ecom.chatbot.dto.ChatResponseDTO;

public interface ChatbotService {

    ChatResponseDTO chat(ChatRequestDTO request);

    ChatResponseDTO getProductSummary(String slug);
}
