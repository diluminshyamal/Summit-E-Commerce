package com.example.product.dto.responses;


import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NonNull;
import lombok.ToString;
import org.springframework.http.HttpStatus;

@Data
@ToString
public class ResponseObject {
    @NotNull
    private Object data;
    @NotNull
    private HttpStatus status;

}
