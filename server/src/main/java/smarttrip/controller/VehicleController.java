package smarttrip.controller;

import smarttrip.model.Vehicle;
import smarttrip.service.VehicleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@PreAuthorize("hasRole('ADMIN')")
public class VehicleController {


    @Autowired
    private VehicleService vehicleService;


    @GetMapping
    public List<Vehicle> getVehicles() {
        return vehicleService.getAllVehicles();
    }


    @PostMapping
    public Vehicle createVehicle(@RequestBody Vehicle vehicle) {
        return vehicleService.addVehicle(vehicle);
    }


    @PutMapping("/{id}")
    public Vehicle updateVehicle(
            @PathVariable Long id,
            @RequestBody Vehicle vehicle) {

        return vehicleService.updateVehicle(id, vehicle);
    }


    @DeleteMapping("/{id}")
    public String deleteVehicle(
            @PathVariable Long id) {

        vehicleService.deleteVehicle(id);

        return "Vehicle deleted";
    }
}