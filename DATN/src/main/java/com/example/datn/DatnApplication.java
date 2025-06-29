package com.example.datn;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.example.datn", "com.example.datn.Library"})
public class DatnApplication {
    public static void main(String[] args) {
        SpringApplication.run(DatnApplication.class, args);
    }
}
