package com.example.datn.Library.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.stream.Collectors;

public class ExceptionMessageFormatter {

    // Phương thức để xử lý thông điệp từ MethodArgumentNotValidException
    public static String formatValidationMessage(MethodArgumentNotValidException ex) {
        return ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getDefaultMessage())
                .collect(Collectors.joining(", "));
    }

    // Phương thức để xử lý thông điệp từ ConstraintViolationException
    public static String formatConstraintViolationMessage(ConstraintViolationException ex) {
        return ex.getConstraintViolations()
                .stream()
                .map(violation -> {
                    String propertyPath = violation.getPropertyPath().toString();
                    String propertyName = propertyPath.substring(propertyPath.lastIndexOf('.') + 1);
                    return propertyName + ": " + violation.getMessage();
                })
                .collect(Collectors.joining(", "));
    }

    // Phương thức để xử lý thông điệp từ HttpMessageNotReadableException
    public static String formatHttpMessageNotReadableMessage(HttpMessageNotReadableException ex) {
        String message = ex.getMessage();
        int startIndex = message.indexOf("JSON parse error: ");
        if (startIndex != -1) {
            return message.substring(startIndex + "JSON parse error: ".length());
        }
        return "Invalid format";
    }


}
