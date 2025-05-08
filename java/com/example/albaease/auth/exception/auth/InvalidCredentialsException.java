package com.example.albaease.auth.exception.auth;

import com.example.albaease.auth.exception.AuthException;

public class InvalidCredentialsException extends AuthException {
    public InvalidCredentialsException(String message) {
        super(message);
    }
}