package com.example.order.dto;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class OrderItemDto {
    private Long id;
    private Integer quantity;
    private Double price;
    private Long productId;
}