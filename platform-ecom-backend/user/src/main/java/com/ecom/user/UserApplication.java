package com.ecom.user;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = { "com.ecom.user", "com.ecom.common" })
public class UserApplication {

    public static void main(String[] args) {
        System.setProperty("user.timezone", "Asia/Ho_Chi_Minh");
        SpringApplication.run(UserApplication.class, args);

    }

}
