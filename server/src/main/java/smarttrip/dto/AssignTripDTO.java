package smarttrip.dto;

import lombok.Data;

@Data
public class AssignTripDTO {
    private Long tripId;
    private Long driverId;
    private Long vehicleId;
    private Double fare;
}