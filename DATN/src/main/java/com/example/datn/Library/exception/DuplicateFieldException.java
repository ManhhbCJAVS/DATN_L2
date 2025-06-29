package com.example.datn.Library.exception;

public class DuplicateFieldException extends RuntimeException {
    private final String fieldName;
    private final String fieldValue;

    public DuplicateFieldException(String fieldName, String fieldValue) {
        super(String.format("Trường %s với giá trị %s đã tồn tại.", fieldName, fieldValue));
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }

    public String getFieldName() {
        return fieldName;
    }

    public String getFieldValue() {
        return fieldValue;
    }
}