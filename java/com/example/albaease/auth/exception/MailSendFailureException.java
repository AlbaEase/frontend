package com.example.albaease.auth.exception;

public class MailSendFailureException extends RuntimeException {
    public MailSendFailureException(String message) {
        super(message);
    }
}
