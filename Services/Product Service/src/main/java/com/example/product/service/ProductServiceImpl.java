package com.example.product.service;

import com.example.product.dto.ProductDto;
import com.example.product.exception.ProductExceptions;
import com.example.product.model.Product;
import com.example.product.repository.ProductRepository;
import com.example.product.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    private final ModelMapper modelMapper = new ModelMapper();

    @Override
    public ProductDto createProduct(ProductDto productDto) {
        try {
            // Use findById to check if the product exists
            Optional<Product> existingProduct = productRepository.findAll()
                    .stream()
                    .filter(p -> p.getName().equals(productDto.getName()))
                    .findFirst();
            if (existingProduct.isPresent()) {
                throw new ProductExceptions(HttpStatus.BAD_REQUEST, "Product with the name already exists.");
            }

            Product product = modelMapper.map(productDto, Product.class);
            Product savedProduct = productRepository.save(product);

            return modelMapper.map(savedProduct, ProductDto.class);
        } catch (Exception e) {
            throw new ProductExceptions(HttpStatus.INTERNAL_SERVER_ERROR, "Error while creating product.", List.of(e.getMessage()));
        }
    }
    @Override
    public ProductDto updateProduct(Long id, ProductDto productDto) {
        try {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new ProductExceptions(HttpStatus.NOT_FOUND, "Product not found"));

            // Check if the product name already exists (excluding the current product)
            Optional<Product> existingProduct = productRepository.findAll()
                    .stream()
                    .filter(p -> p.getName().equals(productDto.getName()) && p.getId() != id)
                    .findFirst();

            if (existingProduct.isPresent()) {
                throw new ProductExceptions(HttpStatus.BAD_REQUEST, "Product with the name already exists.");
            }

            if (productDto.getName() != null) {
                product.setName(productDto.getName());
            }
            if (productDto.getCategory() != null) {
                product.setCategory(productDto.getCategory());
            }
            if (productDto.getDescription() != null) {
                product.setDescription(productDto.getDescription());
            }
            if (productDto.getPrice() != null) {
                product.setPrice(productDto.getPrice());
            }
            if (productDto.getStock() != null) {
                product.setStock(productDto.getStock());
            }

            // Save the updated product
            Product updatedProduct = productRepository.save(product);

            return modelMapper.map(updatedProduct, ProductDto.class);
        } catch (Exception e) {
            throw new ProductExceptions(HttpStatus.INTERNAL_SERVER_ERROR, "Error while updating product.", List.of(e.getMessage()));
        }
    }

    @Override
    public Page<ProductDto> getAllProducts(Pageable pageable) {
        try {
            Page<Product> products = productRepository.findAll(pageable);
            return products.map(product -> modelMapper.map(product, ProductDto.class));
        } catch (Exception e) {
            throw new ProductExceptions(HttpStatus.INTERNAL_SERVER_ERROR, "Error while fetching products.", List.of(e.getMessage()));
        }
    }

    @Override
    public ProductDto getProductById(Long id) {
        try {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new ProductExceptions(HttpStatus.NOT_FOUND, "Product not found"));
            return modelMapper.map(product, ProductDto.class);
        } catch (Exception e) {
            throw new ProductExceptions(HttpStatus.INTERNAL_SERVER_ERROR, "Error while fetching product by ID.", List.of(e.getMessage()));
        }
    }

    @Override
    public void deleteProduct(Long id) {
        try {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new ProductExceptions(HttpStatus.NOT_FOUND, "Product not found"));
            productRepository.delete(product);
        } catch (Exception e) {
            throw new ProductExceptions(HttpStatus.INTERNAL_SERVER_ERROR, "Error while deleting product.", List.of(e.getMessage()));
        }
    }
}