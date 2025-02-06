package com.example.cart.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartDto {

    private Long id; // Cart ID
    private Long userId; // User ID associated with the cart
    private List<CartItemDto> cartItems; // List of CartItemDto containing product details and quantity

}