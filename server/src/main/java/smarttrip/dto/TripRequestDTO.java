package smarttrip.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class TripRequestDTO {

    @NotBlank(message = "Pickup location is required")
    private String pickupLocation;

    @NotBlank(message = "Drop location is required")
    private String dropLocation;

    @NotNull(message = "Passengers required")
    @Min(1)
    private Integer passengers;

    @NotBlank(message = "Phone number required")
    private String phoneNumber;

    @NotNull(message = "Trip date required")
    private LocalDate tripDate;

    @NotNull(message = "Trip time required")
    private LocalTime tripTime;

    @NotNull(message = "Distance required")
    private Double distanceKm;

    @NotNull(message = "Duration required")
    private Integer durationMin;
}