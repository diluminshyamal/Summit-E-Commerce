package com.example.cart.dto;

import com.example.cart.dto.CartItemDto; // Assuming ProductDto is from the Product Service

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CartItemDto {

    private Long id; // CartItem ID
    private Integer quantity; // Quantity of the product in the cart
    private Double price;


}