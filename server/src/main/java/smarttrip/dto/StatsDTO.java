package smarttrip.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatsDTO {
    private double monthlyRevenue;
    private double annualRevenue;
    private long completedTrips;
    private long totalTrips;
    private long totalVehicles;
    private long totalDrivers;
}
