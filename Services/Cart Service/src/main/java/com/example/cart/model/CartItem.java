package com.example.cart.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId; // Foreign key to Product (assuming the Product Service handles the actual product data)

    private Integer quantity;

    @ManyToOne
    @JoinColumn(name = "id") //
    private Cart cart;
}