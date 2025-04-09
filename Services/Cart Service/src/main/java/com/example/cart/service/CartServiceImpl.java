package com.example.cart.service;

import com.example.cart.dto.CartDto;
import com.example.cart.dto.CartItemDto;
import com.example.cart.exception.CartException;
import com.example.cart.model.Cart;
import com.example.cart.model.CartItem;
import com.example.cart.repository.CartItemRepository;
import com.example.cart.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public CartDto createCart(CartDto cartDto) {
        Cart cart = modelMapper.map(cartDto, Cart.class);
        cart = cartRepository.save(cart);
        return modelMapper.map(cart, CartDto.class);
    }

    @Override
    public CartDto getCartByUserId(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new CartException(HttpStatus.NOT_FOUND, "Cart for the user not found"));

        return modelMapper.map(cart, CartDto.class);
    }

    @Override
    @Transactional
    public CartDto addItemToCart(Long cartId, CartItemDto cartItemDto) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartException(HttpStatus.NOT_FOUND, "Cart not found"));

        CartItem cartItem = modelMapper.map(cartItemDto, CartItem.class);

        // Crucial: Set price and calculate total using Double (consistent with entity)
        if (cartItemDto.getPrice() != null && cartItemDto.getQuantity() != null) {
            cartItem.setPrice(cartItemDto.getPrice()); // Set the unit price
            cartItem.setPrice(cartItemDto.getPrice() * cartItemDto.getQuantity()); // Calculate and set the total price
        } else {
            throw new CartException(HttpStatus.BAD_REQUEST, "Price and quantity are required");
        }

        cartItem.setCart(cart);
        cartItem = cartItemRepository.save(cartItem);

        cart.getCartItems().add(cartItem);
        cartRepository.save(cart);

        return modelMapper.map(cart, CartDto.class);
    }

    @Override
    @Transactional
    public CartDto updateCartItem(Long cartId, Long itemId, CartItemDto cartItemDto) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartException(HttpStatus.NOT_FOUND, "Cart not found"));

        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new CartException(HttpStatus.NOT_FOUND, "Cart item not found"));

        if (!cartItem.getCart().getId().equals(cartId)) {
            throw new CartException(HttpStatus.BAD_REQUEST, "Cart item does not belong to this cart");
        }

        // Update fields individually, handling nulls
        if (cartItemDto.getQuantity() != null) {
            cartItem.setQuantity(cartItemDto.getQuantity());
        }
        if (cartItemDto.getPrice() != null) {
            cartItem.setPrice(cartItemDto.getPrice()); // Update unit price
        }

        // Recalculate total price if quantity or unitPrice is updated
        if (cartItem.getPrice() != null && cartItem.getQuantity() != null) {
            cartItem.setPrice(cartItem.getPrice() * cartItem.getQuantity());
        }

        cartItemRepository.save(cartItem);

        return modelMapper.map(cart, CartDto.class);
    }


    @Override
    @Transactional
    public CartDto removeItemFromCart(Long cartId, Long itemId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartException(HttpStatus.NOT_FOUND, "Cart not found"));

        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new CartException(HttpStatus.NOT_FOUND, "Cart item not found"));

        if (!cartItem.getCart().getId().equals(cartId)) {
            throw new CartException(HttpStatus.BAD_REQUEST, "Cart item does not belong to this cart");
        }

        cartItemRepository.delete(cartItem);
        cart.getCartItems().remove(cartItem);
        cartRepository.save(cart);

        return modelMapper.map(cart, CartDto.class);
    }

    @Override
    public List<CartDto> getAllCarts() {
        List<Cart> carts = cartRepository.findAll();
        return carts.stream()
                .map(cart -> modelMapper.map(cart, CartDto.class))
                .collect(Collectors.toList());
    }


    @Override
    @Transactional
    public void clearCart(Long cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartException(HttpStatus.NOT_FOUND, "Cart not found"));

        cartItemRepository.deleteAll(cart.getCartItems());
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }

    @Override
    public List<CartItemDto> getAllItemsInCart(Long cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartException(HttpStatus.NOT_FOUND, "Cart not found"));

        return cart.getCartItems().stream()
                .map(cartItem -> modelMapper.map(cartItem, CartItemDto.class))
                .collect(Collectors.toList());
    }
}