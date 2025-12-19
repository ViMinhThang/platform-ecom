package com.ecom.product;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = { "com.ecom.product", "com.ecom.common" })
@EnableScheduling
public class ProductApplication {

    public static void main(String[] args) {
        System.setProperty("user.timezone", "Asia/Ho_Chi_Minh");
        SpringApplication.run(ProductApplication.class, args);
    }

}
