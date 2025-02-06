package com.example.order.dto;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class OrderItemDto {
    private Long id;
    private Long productId;
    private int quantity;
    private BigDecimal price;
}