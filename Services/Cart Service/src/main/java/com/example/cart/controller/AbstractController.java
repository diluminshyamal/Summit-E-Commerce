package com.example.cart.controller;

import com.example.cart.dto.responses.ResponseObject;
import com.example.cart.exception.CartException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.*;
import java.util.stream.Collectors;

public abstract class AbstractController {
    private static final Logger LOGGER = LoggerFactory.getLogger(AbstractController.class);

    protected <T>ResponseEntity<ResponseObject> sendResponse(T response , HttpStatus httpStatus) {
        ResponseObject responseBody = new ResponseObject();
        responseBody.setData(response);
        return new ResponseEntity<>(responseBody, httpStatus);
    }

    protected <T>ResponseEntity<ResponseObject> sendNoContentResponse() {
        return ResponseEntity.noContent().build();
    }

    protected <T>ResponseEntity<ResponseObject> sendSuccessResponse(T response) {
        return sendResponse(response, HttpStatus.OK);
    }

    protected <T>ResponseEntity<ResponseObject> sendCreatedResponse(T response) {
        return sendResponse(response, HttpStatus.CREATED);
    }

    @ResponseBody
    @ExceptionHandler(value = CartException.class)
    protected ResponseEntity<ResponseObject> handleCardException(CartException cardExceptions) {
        LOGGER.error("Exception Occurred",cardExceptions);

        Map<String, Object> errorData = new HashMap<>();
        errorData.put("message", cardExceptions.getMessage());
        errorData.put("errors", cardExceptions.getErrors());
        errorData.put("timestamp", cardExceptions.getTimestamp());

        ResponseObject responseBody = new ResponseObject();
        responseBody.setData(errorData);
        responseBody.setStatus(cardExceptions.getHttpStatusCode());
        return new ResponseEntity<>(responseBody, cardExceptions.getHttpStatusCode());
    }

    @ResponseBody
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    protected ResponseEntity<ResponseObject> handleMethodArgumentNotValidException(MethodArgumentNotValidException exception) {
        LOGGER.error("Exception Occurred",exception);
        List<String> errors = exception.getBindingResult().getFieldErrors().stream().map(FieldError::getDefaultMessage).collect(Collectors.toList());
        Map<String, Object> errorData = new HashMap<>();
        errorData.put("message", exception.getMessage());
        errorData.put("errors", errors);
        errorData.put("timestamp", new Date());
        ResponseObject responseBody = new ResponseObject();
        responseBody.setData(errorData);
        responseBody.setStatus(HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST);
    }

}
