package com.example.product.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.Date;
import java.util.List;

@Getter
public class ProductExceptions extends RuntimeException {
    private final List<String> errors;
    private final HttpStatus httpStatusCode;
    private final Date timestamp;

    public ProductExceptions(HttpStatus httpStatusCode, String message, List<String> errors) {
        super(message, null);
        this.httpStatusCode = httpStatusCode;
        this.errors = errors;
        this.timestamp = new Date();
    }

    public ProductExceptions(HttpStatus httpStatusCode, String message) {
        super(message);
        this.httpStatusCode = httpStatusCode;
        this.errors = null;
        this.timestamp = new Date();
    }

    public ProductExceptions(HttpStatus httpStatusCode, String message, List<String> errors, Throwable throwable) {
        super(message, throwable);
        this.httpStatusCode = httpStatusCode;
        this.errors = errors;
        this.timestamp = new Date();
    }

    public HttpStatus getHttpStatusCode() {
        return (httpStatusCode != null) ? httpStatusCode : HttpStatus.INTERNAL_SERVER_ERROR;
    }

    @Override
    public String toString() {
        return "ProductExceptions{" +
                "httpStatusCode=" + httpStatusCode +
                ", errors=" + errors +
                ", timestamp=" + timestamp +
                '}';
    }
}