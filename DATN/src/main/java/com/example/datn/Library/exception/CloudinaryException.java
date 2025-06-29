package com.example.datn.Library.exception;

public class CloudinaryException extends RuntimeException {
    private final String errorCode;

    public CloudinaryException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public CloudinaryException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}