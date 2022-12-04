package com.example.demo.controller;

import com.example.demo.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class TokenController {
    private final TokenService tokenService;

    @GetMapping("/expired")
    public String auth() {
        throw new RuntimeException();
    }

    @GetMapping("/refresh")
    public String refreshToken(@RequestHeader(value = "Auth") String token){
        return tokenService.refreshToken(token);
    }
}