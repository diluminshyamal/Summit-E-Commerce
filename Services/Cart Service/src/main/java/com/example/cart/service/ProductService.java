package com.example.cart.service;

import com.example.cart.dto.CartDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    ProductDto createProduct(ProductDto productDto);
    ProductDto updateProduct(Long id, ProductDto productDto);
    Page<ProductDto> getAllProducts(Pageable pageable);
    ProductDto getProductById(Long id);
    void deleteProduct(Long id);
}