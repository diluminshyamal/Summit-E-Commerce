package com.example.order.controller;

import com.example.order.dto.OrderDto;
import com.example.order.dto.responses.ResponseObject;
import com.example.order.dto.OrderItemDto;
import com.example.order.service.OrderService;
import jakarta.validation.Valid;
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

    @PostMapping("/")
    public ResponseEntity<ResponseObject> createOrder(@Valid @RequestBody OrderDto createOrderRequestBody) {
        OrderDto order = orderService.createOrder(createOrderRequestBody);
        return sendCreatedResponse(order);
    }

    @GetMapping("/")
    public ResponseEntity<ResponseObject> getAllOrders() {
        List<OrderDto> orders = orderService.getAllOrders();
        return sendSuccessResponse(orders);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ResponseObject> getOrderByUserId(@PathVariable Long userId) {
        List<OrderDto> order = orderService.getOrdersByUserId(userId);
        return sendSuccessResponse(order);
    }

    @PostMapping("/{orderId}/items")
    public ResponseEntity<ResponseObject> addItemToOrder(
            @PathVariable Long orderId,
            @Valid @RequestBody OrderItemDto orderItemDto) {
        OrderDto updatedOrder = orderService.addItemToOrder(orderId, orderItemDto);
        return sendSuccessResponse(updatedOrder);
    }

    @PutMapping("/{orderId}/items/{itemId}")
    public ResponseEntity<ResponseObject> updateOrderItem(
            @PathVariable Long orderId,
            @PathVariable Long itemId,
            @Valid @RequestBody OrderItemDto orderItemDto) {
        OrderDto updatedOrder = orderService.updateOrderItem(orderId, itemId, orderItemDto);
        return sendSuccessResponse(updatedOrder);
    }

    @DeleteMapping("/{orderId}/items/{itemId}")
    public ResponseEntity<ResponseObject> removeItemFromOrder(
            @PathVariable Long orderId,
            @PathVariable Long itemId) {
        OrderDto updatedOrder = orderService.removeItemFromOrder(orderId, itemId);
        return sendSuccessResponse(updatedOrder);
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<ResponseObject> clearOrder(@PathVariable Long orderId) {
        orderService.clearOrder(orderId);
        return sendNoContentResponse();
    }

    @GetMapping("/{orderId}/items")
    public ResponseEntity<ResponseObject> getAllItemsInOrder(@PathVariable Long orderId) {
        List<OrderItemDto> orderItems = orderService.getAllItemsInOrder(orderId);
        return sendSuccessResponse(orderItems);
    }
}