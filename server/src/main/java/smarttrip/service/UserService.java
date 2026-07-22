package smarttrip.service;

import smarttrip.model.Role;
import smarttrip.model.User;
import smarttrip.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(User user) {

        // encrypt password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // default role if not given
        if (user.getRole() == null) {
            user.setRole(smarttrip.model.Role.CUSTOMER);
        }

        return userRepository.save(user);
    }

    public Optional<User> login(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    // ---------- DRIVER CRUD ----------

    public List<User> getDrivers() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.DRIVER)
                .collect(Collectors.toList());
    }

    public User createDriver(User data) {
        data.setRole(Role.DRIVER);

        // Treat blank/whitespace-only passwords the same as "not provided"
        // so a driver created without typing a password reliably gets the
        // default instead of silently getting an empty-string password.
        String rawPassword = (data.getPassword() == null || data.getPassword().isBlank())
                ? "driver123"
                : data.getPassword();

        data.setPassword(passwordEncoder.encode(rawPassword));
        return userRepository.save(data);
    }

    public User updateDriver(Long id, User data) {
        User driver = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        driver.setName(data.getName());
        driver.setEmail(data.getEmail());
        driver.setPhone(data.getPhone());

        // only change password if a new one was typed
        if (data.getPassword() != null && !data.getPassword().isBlank()) {
            driver.setPassword(passwordEncoder.encode(data.getPassword()));
        }

        return userRepository.save(driver);
    }

    public void deleteDriver(Long id) {
        userRepository.deleteById(id);
    }
}