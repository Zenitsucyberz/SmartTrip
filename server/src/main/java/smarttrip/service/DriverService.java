package smarttrip.service;

import smarttrip.model.User;
import smarttrip.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DriverService {

    private final UserRepository userRepository;

    public DriverService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllDrivers() {
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getRole().name().equals("DRIVER"))
                .collect(Collectors.toList());
    }
}