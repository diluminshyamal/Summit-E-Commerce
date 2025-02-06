package com.example.order.service;

import com.example.order.dto.OrderDto;
import java.util.List;

public interface OrderService {
    OrderDto createOrder(OrderDto orderDto); // Now takes OrderDto directly
    OrderDto getOrderById(Long orderId);
    List<OrderDto> getOrdersByUserId(String userId);
    OrderDto updateOrder(Long orderId, OrderDto orderDto);
    void deleteOrder(Long orderId);
    List<OrderDto> getAllOrders();

    OrderDto createOrder(String userId, List<Long> cartItemIds);
}

