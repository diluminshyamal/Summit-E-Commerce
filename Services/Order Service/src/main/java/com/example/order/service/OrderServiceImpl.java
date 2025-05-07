package com.example.order.service;

import com.example.order.dto.OrderDto;
import com.example.order.dto.OrderItemDto;
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
    public OrderDto createOrder(OrderDto orderDto) {
        Order order = modelMapper.map(orderDto, Order.class);
        if (orderDto.getOrderItems() != null && !orderDto.getOrderItems().isEmpty()) {
            for (OrderItemDto orderItemDto : orderDto.getOrderItems()) {
                OrderItem orderItem = modelMapper.map(orderItemDto, OrderItem.class);
                orderItem.setOrder(order);
                if (orderItem.getPrice() != null && orderItem.getQuantity() != null) {
                    orderItem.setTotalPrice(orderItem.getPrice() * orderItem.getQuantity());
                }
                order.getOrderItems().add(orderItem);
            }
        }
        Order savedOrder = orderRepository.save(order);
        return modelMapper.map(savedOrder, OrderDto.class);
    }

    @Override
    public List<OrderDto> getOrdersByUserId(Long userId) {
        List<Order> orders = orderRepository.getOrdersByUserId(userId);
        if (orders.isEmpty()) {
            throw new OrderException(HttpStatus.NOT_FOUND, "Orders for the user not found");
        }
        return orders.stream()
                .map(order -> modelMapper.map(order, OrderDto.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderDto addItemToOrder(Long orderId, OrderItemDto orderItemDto) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderException(HttpStatus.NOT_FOUND, "Order not found"));

        OrderItem orderItem = modelMapper.map(orderItemDto, OrderItem.class);

        if (orderItem.getPrice() == null || orderItem.getQuantity() == null) {
            throw new OrderException(HttpStatus.BAD_REQUEST, "Price and quantity are required for an order item");
        }

        orderItem.setTotalPrice(orderItem.getPrice() * orderItem.getQuantity()); // Setting totalPrice here
        orderItem.setOrder(order);
        OrderItem savedOrderItem = orderItemRepository.save(orderItem);

        order.getOrderItems().add(savedOrderItem);
        Order updatedOrder = orderRepository.save(order);

        return modelMapper.map(updatedOrder, OrderDto.class);
    }

    @Override
    @Transactional
    public OrderDto updateOrderItem(Long orderId, Long itemId, OrderItemDto orderItemDto) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderException(HttpStatus.NOT_FOUND, "Order not found"));

        OrderItem orderItem = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new OrderException(HttpStatus.NOT_FOUND, "Order item not found"));

        if (!orderItem.getOrder().getId().equals(orderId)) {
            throw new OrderException(HttpStatus.BAD_REQUEST, "Order item does not belong to this order");
        }

        modelMapper.map(orderItemDto, orderItem); // Update existing orderItem with DTO values

        if (orderItem.getPrice() != null && orderItem.getQuantity() != null) {
            orderItem.setTotalPrice(orderItem.getPrice() * orderItem.getQuantity()); // Setting totalPrice here
        }

        OrderItem updatedOrderItem = orderItemRepository.save(orderItem);

        return modelMapper.map(order, OrderDto.class);
    }

    @Override
    @Transactional
    public OrderDto removeItemFromOrder(Long orderId, Long itemId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderException(HttpStatus.NOT_FOUND, "Order not found"));

        OrderItem orderItem = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new OrderException(HttpStatus.NOT_FOUND, "Order item not found"));

        if (!orderItem.getOrder().getId().equals(orderId)) {
            throw new OrderException(HttpStatus.BAD_REQUEST, "Order item does not belong to this order");
        }

        orderItemRepository.delete(orderItem);
        order.getOrderItems().remove(orderItem);
        orderRepository.save(order);

        return modelMapper.map(order, OrderDto.class);
    }

    @Override
    public List<OrderDto> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(order -> modelMapper.map(order, OrderDto.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void clearOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderException(HttpStatus.NOT_FOUND, "Order not found"));

        orderItemRepository.deleteAll(order.getOrderItems());
        order.getOrderItems().clear();
        orderRepository.save(order);
    }

    @Override
    public List<OrderItemDto> getAllItemsInOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderException(HttpStatus.NOT_FOUND, "Order not found"));

        return order.getOrderItems().stream()
                .map(orderItem -> modelMapper.map(orderItem, OrderItemDto.class))
                .collect(Collectors.toList());
    }
}