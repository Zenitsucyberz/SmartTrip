package smarttrip.service;

import smarttrip.dto.LoginRequest;
import smarttrip.dto.LoginResponse;
import smarttrip.dto.RegisterRequest;
import smarttrip.model.Role;
import smarttrip.model.User;
import smarttrip.repository.UserRepository;
import smarttrip.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return buildResponse(user);
    }

    // Self-service signup: always creates a CUSTOMER account, then logs them
    // straight in by returning a token (same shape as login).
    public LoginResponse register(RegisterRequest request) {

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new RuntimeException("Password is required");
        }

        userRepository.findByEmail(request.getEmail()).ifPresent(existing -> {
            throw new RuntimeException("An account with this email already exists");
        });

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.CUSTOMER);
        user.setCreatedAt(java.time.LocalDateTime.now());

        User saved = userRepository.save(user);
        return buildResponse(saved);
    }

    private LoginResponse buildResponse(User user) {
        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                jwtService.generateToken(user)
        );
    }
}