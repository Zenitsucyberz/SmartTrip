package smarttrip.controller;

import smarttrip.dto.PlaceSuggestionDTO;
import smarttrip.dto.TripInsightDTO;
import smarttrip.service.InsightService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/insights")
@PreAuthorize("hasRole('CUSTOMER')")
public class InsightController {

    @Autowired
    private InsightService insightService;

    // GET /api/insights?pickup=Almaty&drop=Astana
    @GetMapping
    public ResponseEntity<?> getInsight(@RequestParam String pickup,
                                        @RequestParam String drop) {
        try {
            TripInsightDTO result = insightService.getInsight(pickup, drop);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            // Surface the real reason (bad key, location not found, etc.)
            return ResponseEntity.badRequest().body("Insight failed: " + e.getMessage());
        }
    }

    // GET /api/insights/autocomplete?query=Kyoto - powers the address
    // suggestion dropdowns on the Book Trip form.
    @GetMapping("/autocomplete")
    public ResponseEntity<?> autocomplete(@RequestParam String query) {
        try {
            List<PlaceSuggestionDTO> results = insightService.autocomplete(query);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Autocomplete failed: " + e.getMessage());
        }
    }
}
