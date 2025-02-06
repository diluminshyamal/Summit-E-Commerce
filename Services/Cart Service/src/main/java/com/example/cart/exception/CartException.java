package com.example.cart.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime; // Use LocalDateTime
import java.util.List;

@Getter
public class CartException extends RuntimeException { // Renamed to CartException
    private final List<String> errors;
    private final HttpStatus httpStatusCode;
    private final LocalDateTime timestamp; // Changed to LocalDateTime

    public CartException(HttpStatus httpStatusCode, String message, List<String> errors) {
        super(message);
        this.httpStatusCode = httpStatusCode;
        this.errors = errors;
        this.timestamp = LocalDateTime.now(); // Use LocalDateTime.now()
    }

    public CartException(HttpStatus httpStatusCode, String message) {
        super(message);
        this.httpStatusCode = httpStatusCode;
        this.errors = null;
        this.timestamp = LocalDateTime.now();
    }

    public CartException(HttpStatus httpStatusCode, String message, List<String> errors, Throwable throwable) {
        super(message, throwable);
        this.httpStatusCode = httpStatusCode;
        this.errors = errors;
        this.timestamp = LocalDateTime.now();
    }

    public HttpStatus getHttpStatusCode() {
        return (httpStatusCode != null) ? httpStatusCode : HttpStatus.INTERNAL_SERVER_ERROR;
    }


    @Override
    public String toString() {
        return "CartException{" +  // Corrected class name
                "httpStatusCode=" + httpStatusCode +
                ", errors=" + errors +
                ", timestamp=" + timestamp +
                '}';
    }
}