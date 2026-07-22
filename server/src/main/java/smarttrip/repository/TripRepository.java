package smarttrip.repository;

import smarttrip.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findByDriverEmail(String email);

    List<Trip> findByCustomerEmail(String email);
}
