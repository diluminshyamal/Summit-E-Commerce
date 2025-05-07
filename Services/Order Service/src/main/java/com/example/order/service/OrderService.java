package com.example.order.service;

import com.example.order.dto.OrderDto;
import com.example.order.dto.OrderItemDto;

import java.util.List;

public interface OrderService {

    OrderDto createOrder(OrderDto orderDto);

    OrderDto addItemToOrder(Long orderId, OrderItemDto orderItemDto);

    OrderDto updateOrderItem(Long orderId, Long itemId, OrderItemDto orderItemDto);

    OrderDto removeItemFromOrder(Long orderId, Long itemId);

    void clearOrder(Long orderId);

    List<OrderDto> getAllOrders();

    List<OrderDto> getOrdersByUserId(Long userId);

    List<OrderItemDto> getAllItemsInOrder(Long orderId);
}
