package smarttrip.controller;

import smarttrip.dto.*;
import smarttrip.model.Trip;
import smarttrip.service.TripService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    @Autowired
    private TripService tripService;

    // CREATE TRIP
    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping
    public Trip createTrip(@Valid @RequestBody TripRequestDTO dto,
                           Principal principal) {

        return tripService.createTrip(dto, principal.getName());
    }

    // GET ALL (admin)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<Trip> getAll() {
        return tripService.getAllTrips();
    }

    // GET MY TRIPS (logged-in customer)
    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/my")
    public List<Trip> getMyTrips(Principal principal) {
        return tripService.getTripsForCustomer(principal.getName());
    }

    // GET TRIPS ASSIGNED TO LOGGED-IN DRIVER
    @PreAuthorize("hasRole('DRIVER')")
    @GetMapping("/driver")
    public List<Trip> getDriverTrips(Principal principal) {
        return tripService.getTripsForDriver(principal.getName());
    }

    // GET ONE (any authenticated role)
    @GetMapping("/{id}")
    public Trip getOne(@PathVariable Long id) {
        return tripService.getTrip(id);
    }

    // ASSIGN
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/assign")
    public Trip assign(@RequestBody AssignTripDTO dto) {
        return tripService.assignTrip(
                dto.getTripId(),
                dto.getDriverId(),
                dto.getVehicleId(),
                dto.getFare()
        );
    }

    // DRIVER ACTIONS
    @PreAuthorize("hasRole('DRIVER')")
    @PutMapping("/{id}/accept")
    public Trip accept(@PathVariable Long id) {
        return tripService.acceptTrip(id);
    }

    @PreAuthorize("hasRole('DRIVER')")
    @PutMapping("/{id}/reject")
    public Trip reject(@PathVariable Long id) {
        return tripService.rejectTrip(id);
    }

    @PreAuthorize("hasRole('DRIVER')")
    @PutMapping("/{id}/complete")
    public Trip complete(@PathVariable Long id) {
        return tripService.completeTrip(id);
    }
}