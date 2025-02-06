package com.example.product.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank(message = "Name is Required")
    private String name;

    @NotBlank(message = "Category is Required")
    private String category;

    private String description;

    @NotNull(message = "Price is Required")
    private BigDecimal price;

    @NotNull(message = "Stock is Required")
    private Integer stock;
}