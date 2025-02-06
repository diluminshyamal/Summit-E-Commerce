package com.example.product.controller;


import com.example.product.dto.ProductDto;
import com.example.product.dto.responses.ResponseObject;
import com.example.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("v1/api/products")
@Validated
@RequiredArgsConstructor
public class ProductController extends AbstractController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ResponseObject> createProduct(@Valid @RequestBody ProductDto productDTO) {
        ProductDto savedProduct = productService.createProduct(productDTO);
        return sendCreatedResponse(savedProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseObject> updateProduct(
            @PathVariable("id") Long id,
            @Valid @RequestBody ProductDto productDTO) {
        ProductDto updatedProduct = productService.updateProduct(id, productDTO);
        return sendSuccessResponse(updatedProduct);
    }

    @GetMapping
    public ResponseEntity<ResponseObject> getAllProducts(Pageable pageable) {
        Page<ProductDto> products = productService.getAllProducts(pageable);
        return sendSuccessResponse(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getProductById(@PathVariable("id") Long id) {
        ProductDto product = productService.getProductById(id);
        return sendSuccessResponse(product);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deleteProduct(@PathVariable("id") Long id) {
        productService.deleteProduct(id);
        return sendNoContentResponse();
    }
}