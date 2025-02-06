package com.example.order.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
public class OrderDto {
    private Long id;
    private String userId; // User ID as a String
    private List<OrderItemDto> orderItems;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private String status;
}