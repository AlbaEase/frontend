package com.example.albaease.auth.exception.validation;

import com.example.albaease.auth.exception.ValidationException;

public class IDAlreadyExistsException extends ValidationException {
    public IDAlreadyExistsException(String message) {
        super(message);
    }
}
