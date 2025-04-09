package com.example.cart.controller;

import com.example.cart.dto.CartDto;
import com.example.cart.dto.CartItemDto;
import com.example.cart.dto.responses.ResponseObject;
import com.example.cart.exception.CartException;
import com.example.cart.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("v1/api/carts")
@Validated
@RequiredArgsConstructor
public class CartController extends AbstractController {

    private final CartService cartService;

    @PostMapping("/")
    public ResponseEntity<ResponseObject> createCart(@Valid @RequestBody CartDto createCartRequestBody) {
        CartDto cart = cartService.createCart(createCartRequestBody);
        return sendCreatedResponse(cart);
    }

    @GetMapping("/")
    public List<CartDto> getAllCarts() {
        return cartService.getAllCarts(); // Now it correctly expects List<CartDto>
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ResponseObject> getCartByUserId(@PathVariable Long userId) {
        CartDto cart = cartService.getCartByUserId(userId);

        if (cart == null) {
            return new ResponseEntity<>(new ResponseObject(), HttpStatus.NOT_FOUND);
        }

        return sendSuccessResponse(cart);
    }


    @PostMapping("/{cartId}/items")
    public ResponseEntity<ResponseObject> addItemToCart(
            @PathVariable Long cartId,
            @Valid @RequestBody CartItemDto cartItemDto) {

        CartDto updatedCart = cartService.addItemToCart(cartId, cartItemDto);
        return sendSuccessResponse(updatedCart);
    }

    @PutMapping("/{cartId}/items/{itemId}")
    public ResponseEntity<ResponseObject> updateCartItem(
            @PathVariable Long cartId,
            @PathVariable Long itemId,
            @Valid @RequestBody CartItemDto cartItemDto) {
        CartDto updatedCart = cartService.updateCartItem(cartId, itemId, cartItemDto);
        return sendSuccessResponse(updatedCart);
    }

    @DeleteMapping("/{cartId}/items/{itemId}")
    public ResponseEntity<ResponseObject> removeItemFromCart(
            @PathVariable Long cartId,
            @PathVariable Long itemId) {
        CartDto updatedCart = cartService.removeItemFromCart(cartId, itemId);
        return sendSuccessResponse(updatedCart);
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<ResponseObject> clearCart(@PathVariable Long cartId) {
        cartService.clearCart(cartId);
        return sendNoContentResponse();
    }

    @GetMapping("/{cartId}/items")
    public ResponseEntity<ResponseObject> getAllItemsInCart(@PathVariable Long cartId) {
        List<CartItemDto> cartItems = cartService.getAllItemsInCart(cartId);
        return sendSuccessResponse(cartItems);
    }


}