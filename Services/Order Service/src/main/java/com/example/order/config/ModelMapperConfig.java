package com.example.order.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean // This annotation makes the ModelMapper instance available for autowiring
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}