package com.example.user.controller;

import com.example.user.dto.responses.ResponseObject;
import com.example.user.exception.UserExceptions;
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

    protected <T> ResponseEntity<ResponseObject> sendResponse(T response, HttpStatus httpStatus) {
        ResponseObject responseBody = new ResponseObject();
        responseBody.setData(response);
        responseBody.setStatus(HttpStatus.valueOf(httpStatus.value()));
        return new ResponseEntity<>(responseBody, httpStatus);
    }

    protected <T> ResponseEntity<ResponseObject> sendNoContentResponse() {
        return ResponseEntity.noContent().build();
    }

    protected <T> ResponseEntity<ResponseObject> sendSuccessResponse(T response) {
        return sendResponse(response, HttpStatus.OK);
    }

    protected <T> ResponseEntity<ResponseObject> sendCreatedResponse(T response) {
        return sendResponse(response, HttpStatus.CREATED);
    }

    @ResponseBody
    @ExceptionHandler(UserExceptions.class)
    protected ResponseEntity<ResponseObject> handleUserException(UserExceptions ex) {
        LOGGER.error("Exception Occurred", ex);

        Map<String, Object> errorData = new HashMap<>();
        errorData.put("message", ex.getMessage());
        errorData.put("errors", ex.getErrors());
        errorData.put("timestamp", ex.getTimestamp());

        ResponseObject responseBody = new ResponseObject();
        responseBody.setData(errorData);
        responseBody.setStatus(ex.getHttpStatusCode());
        return new ResponseEntity<>(responseBody, ex.getHttpStatusCode());
    }

    @ResponseBody
    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<ResponseObject> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        LOGGER.error("Exception Occurred", ex);
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.toList());
        Map<String, Object> errorData = new HashMap<>();
        errorData.put("message", "Validation failed"); // More generic message
        errorData.put("errors", errors);
        errorData.put("timestamp", new Date());
        ResponseObject responseBody = new ResponseObject();
        responseBody.setData(errorData);
        responseBody.setStatus(HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST);
    }
}