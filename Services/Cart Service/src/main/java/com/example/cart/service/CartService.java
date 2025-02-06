package com.example.cart.service;

import com.example.cart.dto.CartDto;
import com.example.cart.dto.CartItemDto;

import java.util.List;

public interface CartService {

    CartDto createCart(CartDto cartDto);

    CartDto addItemToCart(Long cartId, CartItemDto cartItemDto);

    CartDto updateCartItem(Long cartId, Long itemId, CartItemDto cartItemDto);

    CartDto removeItemFromCart(Long cartId, Long itemId);

    void clearCart(Long cartId);

    List<CartItemDto> getAllItemsInCart(Long cartId);
}