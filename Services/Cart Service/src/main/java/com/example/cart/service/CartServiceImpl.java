package com.example.cart.service;

import com.example.cart.dto.CartDto;
import com.example.cart.dto.CartItemDto;
import com.example.cart.exception.CartException;
import com.example.cart.model.Cart;
import com.example.cart.model.CartItem;
import com.example.cart.repository.CartRepository;
import com.example.cart.repository.CartItemRepository;
import com.example.product.dto.ProductDto;
import com.example.product.service.ProductServiceClient; // Assuming you're using a client to call the product service

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository; // Repository for CartItem

    @Autowired
    private ProductServiceClient productServiceClient; // Client to fetch product information

    private final ModelMapper modelMapper = new ModelMapper();

    // Get the cart details along with cart items
    @Override
    public CartDto getCartDetails(Long cartId) {
        try {
            Cart cart = cartRepository.findById(cartId)
                    .orElseThrow(() -> new CartException(HttpStatus.NOT_FOUND, "Cart not found"));

            List<CartItemDto> cartItemDtos = cart.getCartItems().stream()
                    .map(cartItem -> {
                        // Assuming a method that fetches product details from the product service
                        ProductDto product = productServiceClient.getProductById(cartItem.getProductId());
                        return new CartItemDto(cartItem.getId(), product, cartItem.getQuantity());
                    })
                    .collect(Collectors.toList());

            return new CartDto(cart.getId(), cart.getUserId(), cartItemDtos);
        } catch (Exception e) {
            throw new CartException(HttpStatus.INTERNAL_SERVER_ERROR, "Error while fetching cart details", List.of(e.getMessage()));
        }
    }

    // Add an item to the cart
    @Override
    public CartDto addCartItem(Long cartId, CartItemDto cartItemDto) {
        try {
            Cart cart = cartRepository.findById(cartId)
                    .orElseThrow(() -> new CartException(HttpStatus.NOT_FOUND, "Cart not found"));

            // Validate if the product exists
            ProductDto product = productServiceClient.getProductById(cartItemDto.getProduct().getId());

            // Check if the product is already in the cart, then update the quantity
            Optional<CartItem> existingCartItem = cartItemRepository.findByCartAndProductId(cart, cartItemDto.getProduct().getId());
            if (existingCartItem.isPresent()) {
                CartItem cartItem = existingCartItem.get();
                cartItem.setQuantity(cartItem.getQuantity() + cartItemDto.getQuantity());
                cartItemRepository.save(cartItem);
            } else {
                // If not present, add a new cart item
                CartItem newCartItem = new CartItem();
                newCartItem.setCart(cart);
                newCartItem.setProductId(cartItemDto.getProduct().getId());
                newCartItem.setQuantity(cartItemDto.getQuantity());
                cartItemRepository.save(newCartItem);
            }

            // Fetch updated cart details
            return getCartDetails(cartId);
        } catch (Exception e) {
            throw new CartException(HttpStatus.INTERNAL_SERVER_ERROR, "Error while adding item to cart", List.of(e.getMessage()));
        }
    }

    // Remove an item from the cart
    @Override
    public CartDto removeCartItem(Long cartId, Long cartItemId) {
        try {
            Cart cart = cartRepository.findById(cartId)
                    .orElseThrow(() -> new CartException(HttpStatus.NOT_FOUND, "Cart not found"));

            CartItem cartItem = cartItemRepository.findById(cartItemId)
                    .orElseThrow(() -> new CartException(HttpStatus.NOT_FOUND, "Cart item not found"));

            // Remove the cart item
            cartItemRepository.delete(cartItem);

            // Fetch updated cart details
            return getCartDetails(cartId);
        } catch (Exception e) {
            throw new CartException(HttpStatus.INTERNAL_SERVER_ERROR, "Error while removing item from cart", List.of(e.getMessage()));
        }
    }
}