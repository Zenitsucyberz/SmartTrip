package smarttrip.service;

import smarttrip.model.Vehicle;
import smarttrip.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    public Vehicle addVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle updateVehicle(Long id, Vehicle vehicle) {
        Vehicle v = vehicleRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        
        v.setVehicleNumber(vehicle.getVehicleNumber());
        v.setModel(vehicle.getModel());
        v.setCapacity(vehicle.getCapacity());
        v.setFuelType(vehicle.getFuelType());
        v.setStatus(vehicle.getStatus());

        return vehicleRepository.save(v);
    }

    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }
}