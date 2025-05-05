package com.example.albaease.auth.exception.validation;
import com.example.albaease.auth.exception.ValidationException;

public class PasswordMismatchException extends ValidationException {
    public PasswordMismatchException(String message) {
        super(message);
    }
}