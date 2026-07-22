package smarttrip.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TripInsightDTO {
    private double distanceKm;
    private double durationMin;
    private double fareEstimate;
    private String weatherDescription;
    private double temperature;

    // Pickup/drop coordinates plus the routed path between them, each as
    // [lat, lon] - lets the frontend draw pins + a route line without a
    // second geocode/directions round trip.
    private double[] pickupCoordinates;
    private double[] dropCoordinates;
    private List<double[]> routePath;
}
