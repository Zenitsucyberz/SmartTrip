package smarttrip.service;

import smarttrip.dto.RevenueBreakdownDTO;
import smarttrip.dto.RevenuePointDTO;
import smarttrip.dto.StatsDTO;
import smarttrip.model.Trip;
import smarttrip.model.TripStatus;
import smarttrip.repository.TripRepository;
import smarttrip.repository.UserRepository;
import smarttrip.repository.VehicleRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
public class StatsService {

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private UserRepository userRepository;

    // ADMIN stats (all completed trips)
    public StatsDTO getAdminStats() {
        List<Trip> all = tripRepository.findAll();
        return buildStats(all, true);
    }

    // DRIVER stats (only that driver's completed trips)
    public StatsDTO getDriverStats(String driverEmail) {
        List<Trip> mine = tripRepository.findByDriverEmail(driverEmail);
        return buildStats(mine, false);
    }

    // Revenue broken down for the bar chart
    public RevenueBreakdownDTO getAdminRevenue() {
        List<Trip> trips = tripRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        String[] monthNames = {
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        };

        double[] monthTotals = new double[12];
        Map<Integer, Double> yearTotals = new TreeMap<>();

        for (Trip t : trips) {
            if (t.getStatus() != TripStatus.COMPLETED) continue;

            double fare = t.getFare() == null ? 0 : t.getFare();
            LocalDateTime created = t.getCreatedAt() == null ? now : t.getCreatedAt();

            // annual: sum per year
            yearTotals.merge(created.getYear(), fare, Double::sum);

            // monthly: only current year
            if (created.getYear() == now.getYear()) {
                monthTotals[created.getMonthValue() - 1] += fare;
            }
        }

        List<RevenuePointDTO> monthly = new ArrayList<>();
        for (int i = 0; i < 12; i++) {
            monthly.add(new RevenuePointDTO(monthNames[i], monthTotals[i]));
        }

        List<RevenuePointDTO> annual = new ArrayList<>();
        for (Map.Entry<Integer, Double> e : yearTotals.entrySet()) {
            annual.add(new RevenuePointDTO(String.valueOf(e.getKey()), e.getValue()));
        }
        if (annual.isEmpty()) {
            annual.add(new RevenuePointDTO(String.valueOf(now.getYear()), 0));
        }

        return new RevenueBreakdownDTO(monthly, annual);
    }

    private StatsDTO buildStats(List<Trip> trips, boolean isAdmin) {
        LocalDateTime now = LocalDateTime.now();

        double monthly = 0;
        double annual = 0;
        long completed = 0;

        for (Trip t : trips) {
            boolean isCompleted = t.getStatus() == TripStatus.COMPLETED;
            if (!isCompleted) continue;

            completed++;
            double fare = t.getFare() == null ? 0 : t.getFare();
            LocalDateTime created = t.getCreatedAt() == null ? now : t.getCreatedAt();

            if (created.getYear() == now.getYear()) {
                annual += fare;
                if (created.getMonthValue() == now.getMonthValue()) {
                    monthly += fare;
                }
            }
        }

        long totalVehicles = isAdmin ? vehicleRepository.count() : 0;
        long totalDrivers = isAdmin
                ? userRepository.findAll().stream()
                    .filter(u -> u.getRole() != null && u.getRole().name().equals("DRIVER"))
                    .count()
                : 0;

        return new StatsDTO(
                monthly,
                annual,
                completed,
                trips.size(),
                totalVehicles,
                totalDrivers
        );
    }
}
