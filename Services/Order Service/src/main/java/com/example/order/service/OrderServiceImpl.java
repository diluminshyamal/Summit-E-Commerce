// service/OrderServiceImpl.java
package com.example.order.service;

import com.example.order.dto.OrderDto;
import com.example.order.exception.OrderException;
import com.example.order.model.Order;
import com.example.order.model.OrderItem;
import com.example.order.repository.OrderItemRepository;
import com.example.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public OrderDto createOrder(OrderDto orderDto) { // Takes OrderDto directly
        Order order = modelMapper.map(orderDto, Order.class);

        // Map OrderItems and set the Order for each
        List<OrderItem> orderItems = orderDto.getOrderItems().stream()
                .map(orderItemDto -> modelMapper.map(orderItemDto, OrderItem.class))
                .collect(Collectors.toList());

        order.setOrderItems(orderItems);
        Order finalOrder = order;
        orderItems.forEach(orderItem -> orderItem.setOrder(finalOrder));

        order = orderRepository.save(order);
        return modelMapper.map(order, OrderDto.class);
    }

    @Override
    public OrderDto getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderException(HttpStatus.NOT_FOUND, "Order not found"));
        return modelMapper.map(order, OrderDto.class);
    }

    @Override
    public List<OrderDto> getOrdersByUserId(String userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream()
                .map(order -> modelMapper.map(order, OrderDto.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderDto updateOrder(Long orderId, OrderDto orderDto) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderException(HttpStatus.NOT_FOUND, "Order not found"));

        modelMapper.map(orderDto, order);



        List<OrderItem> updatedOrderItems = orderDto.getOrderItems().stream()
                .map(orderItemDto -> modelMapper.map(orderItemDto, OrderItem.class))
                .collect(Collectors.toList());


        order.setOrderItems(updatedOrderItems);

        order = orderRepository.save(order);
        return modelMapper.map(order, OrderDto.class);
    }


    @Override
    public void deleteOrder(Long orderId) {
        orderRepository.deleteById(orderId);
    }

    @Override
    public List<OrderDto> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(order -> modelMapper.map(order, OrderDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public OrderDto createOrder(String userId, List<Long> cartItemIds) {
        return null;
    }
}