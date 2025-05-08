package com.example.albaease.auth.exception.auth;


import com.example.albaease.auth.exception.AuthException;

public class InvalidVerificationCodeException extends AuthException {
    public InvalidVerificationCodeException(String message) {
        super(message);
    }
}