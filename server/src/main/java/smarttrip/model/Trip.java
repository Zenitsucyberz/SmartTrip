package smarttrip.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "trips")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String pickupLocation;

    private String dropLocation;

    private Integer passengers;

    // NEW
    private String phoneNumber;

    // NEW
    private LocalDate tripDate;

    // NEW
    private LocalTime tripTime;

    // NEW
    private Double distanceKm;

    // NEW
    private Integer durationMin;

    // Admin enters this later
    private Double fare;

    private LocalDateTime createdAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private TripStatus status;

    @ManyToOne
    private User customer;

    @ManyToOne
    private User driver;

    @ManyToOne
    private Vehicle vehicle;
}