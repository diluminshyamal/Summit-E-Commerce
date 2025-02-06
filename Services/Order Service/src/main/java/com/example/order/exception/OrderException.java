package com.example.order.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class OrderException extends RuntimeException {

    private final List<String> errors;
    private final HttpStatus httpStatusCode;
    private final LocalDateTime timestamp;

    public OrderException(HttpStatus httpStatusCode, String message, List<String> errors) {
        super(message);
        this.httpStatusCode = httpStatusCode;
        this.errors = errors;
        this.timestamp = LocalDateTime.now();
    }

    public OrderException(HttpStatus httpStatusCode, String message) {
        super(message);
        this.httpStatusCode = httpStatusCode;
        this.errors = null;
        this.timestamp = LocalDateTime.now();
    }

    public OrderException(HttpStatus httpStatusCode, String message, List<String> errors, Throwable throwable) {
        super(message, throwable);
        this.httpStatusCode = httpStatusCode;
        this.errors = errors;
        this.timestamp = LocalDateTime.now();
    }

    public OrderException(HttpStatus httpStatusCode, String message, Throwable throwable) {
        super(message, throwable);
        this.httpStatusCode = httpStatusCode;
        this.errors = null;
        this.timestamp = LocalDateTime.now();
    }


    public HttpStatus getHttpStatusCode() {
        return (httpStatusCode != null) ? httpStatusCode : HttpStatus.INTERNAL_SERVER_ERROR;
    }

    @Override
    public String toString() {
        return "OrderException{" +
                "httpStatusCode=" + httpStatusCode +
                ", errors=" + errors +
                ", timestamp=" + timestamp +
                '}';
    }
}