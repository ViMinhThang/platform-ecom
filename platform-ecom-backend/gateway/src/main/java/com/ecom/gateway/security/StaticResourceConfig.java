package com.ecom.gateway.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.config.ResourceHandlerRegistry;
import org.springframework.web.reactive.config.WebFluxConfigurer;

import java.nio.file.Paths;

@Configuration
public class StaticResourceConfig implements WebFluxConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Get absolute path to the 'uploads' directory relative to the project root
        String uploadPath = Paths.get("uploads").toAbsolutePath().toUri().toString();
        
        registry
                .addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath);
    }
}
