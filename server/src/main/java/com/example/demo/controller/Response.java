package com.example.demo.controller;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Response{
    private String status;
    private String message;
    private Object result;
}
