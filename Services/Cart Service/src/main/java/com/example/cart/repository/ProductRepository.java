package com.example.cart.repository;

import com.example.cart.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ProductRepository extends JpaRepository<Cart, Long> {
}
