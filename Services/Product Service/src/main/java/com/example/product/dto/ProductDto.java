package com.example.product.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductDto {
    private Long id;
    private String name;
    private String category;
    private String description;
    private BigDecimal price;
    private String image;
    private Integer stock;
}