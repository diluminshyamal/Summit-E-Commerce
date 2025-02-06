package com.example.product.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductDto {
    private Long id;
    private String name;
    private String category;  // changed to camelCase
    private String description;
    private BigDecimal price;
    private Integer stock;
}