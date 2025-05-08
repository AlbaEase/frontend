package com.example.albaease.auth.exception.validation;

import com.example.albaease.auth.exception.ValidationException;
public class IdDuplicationCheckRequiredException extends ValidationException {
    public IdDuplicationCheckRequiredException(String message) {
        super(message);
    }
}
