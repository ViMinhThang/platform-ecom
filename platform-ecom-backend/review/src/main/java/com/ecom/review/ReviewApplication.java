package com.ecom.review;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = { "com.ecom.review", "com.ecom.common" })
public class ReviewApplication {

        public static void main(String[] args) {
                System.setProperty("user.timezone", "Asia/Ho_Chi_Minh");
                SpringApplication.run(ReviewApplication.class, args);
        }

}
