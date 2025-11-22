package com.ecom.product.config;


import com.ecom.product.dto.CategoryDTO;
import com.ecom.product.dto.ProductDTO;
import com.ecom.product.entity.Category;
import com.ecom.product.entity.Product;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class WebConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.typeMap(ProductDTO.class, Product.class)
                .addMappings(mapper -> mapper.skip(Product::setId));

        return modelMapper;
    }

}
