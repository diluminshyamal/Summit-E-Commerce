package com.example.cart.service;

import com.example.cart.dto.CartDto;
import com.example.cart.dto.CartItemDto;
import com.example.cart.model.Cart;

import java.util.List;

public interface CartService {

    CartDto createCart(CartDto cartDto);

    CartDto addItemToCart(Long cartId, CartItemDto cartItemDto);

    CartDto updateCartItem(Long cartId, Long itemId, CartItemDto cartItemDto);

    CartDto removeItemFromCart(Long cartId, Long itemId);

    void clearCart(Long cartId);

    List<CartDto> getAllCarts();

    CartDto getCartByUserId(Long userId);


    List<CartItemDto> getAllItemsInCart(Long cartId);
}