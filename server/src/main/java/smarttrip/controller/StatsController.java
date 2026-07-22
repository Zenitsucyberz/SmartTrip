package smarttrip.controller;

import smarttrip.dto.RevenueBreakdownDTO;
import smarttrip.dto.StatsDTO;
import smarttrip.service.StatsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    @Autowired
    private StatsService statsService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public StatsDTO adminStats() {
        return statsService.getAdminStats();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/revenue")
    public RevenueBreakdownDTO adminRevenue() {
        return statsService.getAdminRevenue();
    }

    @PreAuthorize("hasRole('DRIVER')")
    @GetMapping("/driver")
    public StatsDTO driverStats(Principal principal) {
        return statsService.getDriverStats(principal.getName());
    }
}
