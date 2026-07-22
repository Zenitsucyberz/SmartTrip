package smarttrip.controller;

import smarttrip.model.User;
import smarttrip.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    @Autowired
    private UserService userService;

    // LIST DRIVERS
    @GetMapping("/drivers")
    public List<User> getDrivers() {
        return userService.getDrivers();
    }

    // CREATE DRIVER
    @PostMapping("/drivers")
    public User createDriver(@RequestBody User data) {
        return userService.createDriver(data);
    }

    // UPDATE DRIVER
    @PutMapping("/drivers/{id}")
    public User updateDriver(@PathVariable Long id, @RequestBody User data) {
        return userService.updateDriver(id, data);
    }

    // DELETE DRIVER
    @DeleteMapping("/drivers/{id}")
    public String deleteDriver(@PathVariable Long id) {
        userService.deleteDriver(id);
        return "Driver deleted";
    }
}
