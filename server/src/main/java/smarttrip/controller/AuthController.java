package smarttrip.controller;

import smarttrip.dto.LoginRequest;
import smarttrip.dto.LoginResponse;
import smarttrip.dto.RegisterRequest;
import smarttrip.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    // Public self-service registration (creates a CUSTOMER account)
    @PostMapping("/register")
    public LoginResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }
}