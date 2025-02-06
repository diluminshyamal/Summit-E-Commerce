package com.example.order.controller;

import com.example.order.dto.OrderDto;
import com.example.order.dto.responses.ResponseObject;
import com.example.order.exception.OrderException;
import com.example.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/api/orders")
@Validated
@RequiredArgsConstructor
public class OrderController extends AbstractController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ResponseObject> createOrder(
            @RequestParam String userId,
            @RequestParam List<Long> cartItemIds) {
        try {
            OrderDto createdOrder = orderService.createOrder(userId, cartItemIds);
            return sendCreatedResponse(createdOrder);
        } catch (OrderException e) { // Catch OrderException directly
            throw e; // Re-throw the OrderException
        } catch (Exception e) {
            throw new OrderException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create order", e);
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ResponseObject> getOrderById(@PathVariable Long orderId) {
        OrderDto order = orderService.getOrderById(orderId);
        return sendSuccessResponse(order);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ResponseObject> getOrdersByUserId(@PathVariable String userId) { // userId is a String
        List<OrderDto> orders = orderService.getOrdersByUserId(userId);
        return sendSuccessResponse(orders);
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<ResponseObject> updateOrder(@PathVariable Long orderId, @RequestBody OrderDto orderDto) {
        OrderDto updatedOrder = orderService.updateOrder(orderId, orderDto);
        return sendSuccessResponse(updatedOrder);
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<ResponseObject> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return sendNoContentResponse();
    }

    @GetMapping
    public ResponseEntity<ResponseObject> getAllOrders() {
        List<OrderDto> orders = orderService.getAllOrders();
        return sendSuccessResponse(orders);
    }
}