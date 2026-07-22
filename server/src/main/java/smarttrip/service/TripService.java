package smarttrip.service;

import smarttrip.dto.TripRequestDTO;
import smarttrip.model.*;
import smarttrip.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TripService {

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    // CREATE TRIP
    public Trip createTrip(TripRequestDTO dto, String customerEmail) {

        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Trip trip = new Trip();

        trip.setPickupLocation(dto.getPickupLocation());
        trip.setDropLocation(dto.getDropLocation());
        trip.setPassengers(dto.getPassengers());

        // NEW
        trip.setPhoneNumber(dto.getPhoneNumber());
        trip.setTripDate(dto.getTripDate());
        trip.setTripTime(dto.getTripTime());
        trip.setDistanceKm(dto.getDistanceKm());
        trip.setDurationMin(dto.getDurationMin());

        trip.setCustomer(customer);

        trip.setStatus(TripStatus.PENDING);

        // Admin will enter later
        trip.setFare(null);

        trip.setCreatedAt(java.time.LocalDateTime.now());

        return tripRepository.save(trip);
    }

    // GET ALL
    public java.util.List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    // DRIVER
    public java.util.List<Trip> getTripsForDriver(String driverEmail) {
        return tripRepository.findByDriverEmail(driverEmail);
    }

    // CUSTOMER
    public java.util.List<Trip> getTripsForCustomer(String customerEmail) {
        return tripRepository.findByCustomerEmail(customerEmail);
    }

    // GET ONE
    public Trip getTrip(Long id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
    }

    // ASSIGN (also used to re-assign a trip a driver rejected)
    public Trip assignTrip(Long tripId, Long driverId, Long vehicleId, Double fare) {

        Trip trip = getTrip(tripId);

        // A trip is only assignable while it is waiting for a driver: either
        // brand new (PENDING) or handed back by a driver (REJECTED). Trips that
        // are already ASSIGNED/ACCEPTED/COMPLETED must not be re-assigned.
        if (trip.getStatus() != TripStatus.PENDING && trip.getStatus() != TripStatus.REJECTED) {
            throw new RuntimeException(
                    "Only pending or rejected trips can be assigned (this trip is " + trip.getStatus() + ")");
        }

        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        if (fare == null) {
            throw new RuntimeException("Fare is required");
        }

        trip.setDriver(driver);
        trip.setVehicle(vehicle);
        trip.setFare(fare);
        trip.setStatus(TripStatus.ASSIGNED);

        return tripRepository.save(trip);
    }

    // ACCEPT
    public Trip acceptTrip(Long id) {
        Trip trip = getTrip(id);
        trip.setStatus(TripStatus.ACCEPTED);
        return tripRepository.save(trip);
    }

    // REJECT
    public Trip rejectTrip(Long id) {
        Trip trip = getTrip(id);
        trip.setStatus(TripStatus.REJECTED);
        return tripRepository.save(trip);
    }

    // COMPLETE
    public Trip completeTrip(Long id) {
        Trip trip = getTrip(id);
        trip.setStatus(TripStatus.COMPLETED);
        return tripRepository.save(trip);
    }

}