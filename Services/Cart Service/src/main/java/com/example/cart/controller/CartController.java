package com.example.cart.controller;

import com.example.cart.dto.CartDto;
import com.example.cart.dto.CartItemDto;
import com.example.cart.dto.responses.ResponseObject;
import com.example.cart.exception.CartNotFoundException; // Create custom exceptions
import com.example.cart.service.CartService;
import jakarta.validation.Valid;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<ResponseObject> createCart(@RequestBody CartDto createCartRequestBody) {
        CartDto cart = cartService.createCart(createCartRequestBody);
        return sendCreatedResponse(cart);
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

    @ExceptionHandler(CartNotFoundException.class)
    public ResponseEntity<ResponseObject> handleCartNotFound(CartNotFoundException ex) {
        return sendErrorResponse(ex, HttpStatus.NOT_FOUND); // Helper method (see below)
    }


    // Helper method for consistent error responses
    private ResponseEntity<ResponseObject> sendErrorResponse(Exception ex, HttpStatus status) {
        ResponseObject responseObject = new ResponseObject();
        responseObject.setStatus(status.value());
        responseObject.setData(ex.getMessage()); // Or a more detailed error object
        return new ResponseEntity<>(responseObject, status);
    }

}