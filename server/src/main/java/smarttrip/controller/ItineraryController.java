package smarttrip.controller;

import smarttrip.dto.ItineraryRequestDTO;
import smarttrip.dto.ItineraryStopDTO;
import smarttrip.service.GeminiService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/itinerary")
public class ItineraryController {

    @Autowired
    private GeminiService geminiService;

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/plan")
    public ResponseEntity<?> plan(@RequestBody ItineraryRequestDTO request) {
        try {
            List<ItineraryStopDTO> stops = geminiService.planItinerary(request);
            return ResponseEntity.ok(stops);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
}
