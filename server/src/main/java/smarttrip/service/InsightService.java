package smarttrip.service;

import com.fasterxml.jackson.databind.JsonNode;
import smarttrip.dto.PlaceSuggestionDTO;
import smarttrip.dto.TripInsightDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class InsightService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${openroute.api.key}")
    private String routeKey;

    @Value("${openweather.api.key}")
    private String weatherKey;

    // Combines TWO external APIs (OpenRouteService + OpenWeatherMap)
    public TripInsightDTO getInsight(String pickup, String drop) {

        // 1) Geocode both locations (OpenRouteService)
        double[] from = geocode(pickup);
        double[] to = geocode(drop);

        // 2) Distance + duration between them (OpenRouteService directions)
        String directionsUrl = "https://api.openrouteservice.org/v2/directions/driving-car"
                + "?api_key=" + routeKey
                + "&start=" + from[0] + "," + from[1]
                + "&end=" + to[0] + "," + to[1];

        JsonNode directions = restTemplate.getForObject(directionsUrl, JsonNode.class);
        JsonNode feature = directions.get("features").get(0);
        JsonNode summary = feature.get("properties").get("summary");

        double distanceKm = summary.get("distance").asDouble() / 1000.0;
        double durationMin = summary.get("duration").asDouble() / 60.0;

        // Route geometry comes back as [lon, lat] pairs (GeoJSON order) -
        // flip to [lat, lon] since that's what mapping libraries expect.
        List<double[]> routePath = new ArrayList<>();
        for (JsonNode coord : feature.get("geometry").get("coordinates")) {
            routePath.add(new double[]{coord.get(1).asDouble(), coord.get(0).asDouble()});
        }

        // 3) Weather at the destination (OpenWeatherMap) — non-fatal
        String description = "unavailable";
        double temperature = 0;
        try {
            String weatherUrl = "https://api.openweathermap.org/data/2.5/weather"
                    + "?lat=" + to[1] + "&lon=" + to[0]
                    + "&units=metric"
                    + "&appid=" + weatherKey;

            JsonNode weather = restTemplate.getForObject(weatherUrl, JsonNode.class);
            description = weather.get("weather").get(0).get("description").asText();
            temperature = weather.get("main").get("temp").asDouble();
        } catch (Exception e) {
            // Weather API down or key not active yet — keep distance/time/fare
        }

        // Original feature: simple fare estimate (base 500 + 100 per km)
        double fareEstimate = 500 + (distanceKm * 100);

        return new TripInsightDTO(
                round(distanceKm),
                round(durationMin),
                round(fareEstimate),
                description,
                round(temperature),
                new double[]{from[1], from[0]},
                new double[]{to[1], to[0]},
                routePath
        );
    }

    // ORS geocode autocomplete - powers the pickup/destination suggestion
    // dropdowns on the frontend without exposing the ORS key to the browser.
    public List<PlaceSuggestionDTO> autocomplete(String query) {
        if (query == null || query.isBlank()) {
            return List.of();
        }

        String url = "https://api.openrouteservice.org/geocode/autocomplete"
                + "?api_key=" + routeKey
                + "&size=5"
                + "&text=" + encode(query);

        // Pass a URI (not a String) so RestTemplate uses it as-is - passing a
        // String makes it re-encode the already-encoded text, mangling any
        // multi-word query (e.g. "%20" becomes a literal "%2520").
        JsonNode response = restTemplate.getForObject(URI.create(url), JsonNode.class);
        List<PlaceSuggestionDTO> suggestions = new ArrayList<>();

        for (JsonNode f : response.get("features")) {
            String label = f.get("properties").get("label").asText();
            JsonNode coords = f.get("geometry").get("coordinates");
            suggestions.add(new PlaceSuggestionDTO(label, coords.get(1).asDouble(), coords.get(0).asDouble()));
        }

        return suggestions;
    }

    // OpenRouteService geocoding -> [lon, lat]. ORS's free-tier geocoder has
    // thin building/street-level coverage in many regions, so a precise
    // address (e.g. one an AI itinerary generates) can fail to resolve even
    // though the general area is well known. Fall back to progressively
    // broader versions of the same address - stripping the postal code, then
    // dropping the most specific (leftmost) segment - before giving up.
    private double[] geocode(String place) {
        String withoutPostcode = place.replaceAll("\\b\\d{3,4}-?\\d{3,4}\\b", "").replaceAll(",\\s*,", ",").trim();

        List<String> attempts = new ArrayList<>();
        attempts.add(place);
        if (!withoutPostcode.equals(place)) {
            attempts.add(withoutPostcode);
        }

        String[] segments = withoutPostcode.split(",");
        for (int drop = 1; drop < segments.length; drop++) {
            StringBuilder broadened = new StringBuilder();
            for (int i = drop; i < segments.length; i++) {
                if (broadened.length() > 0) broadened.append(",");
                broadened.append(segments[i]);
            }
            String candidate = broadened.toString().trim();
            if (!candidate.isBlank()) {
                attempts.add(candidate);
            }
        }

        for (String attempt : attempts) {
            JsonNode features = searchFeatures(attempt);
            if (features != null && !features.isEmpty()) {
                JsonNode coords = features.get(0).get("geometry").get("coordinates");
                return new double[]{ coords.get(0).asDouble(), coords.get(1).asDouble() };
            }
        }

        throw new RuntimeException("Couldn't find a location matching \"" + place + "\"");
    }

    private JsonNode searchFeatures(String text) {
        String url = "https://api.openrouteservice.org/geocode/search"
                + "?api_key=" + routeKey
                + "&size=1"
                + "&text=" + encode(text);

        JsonNode response = restTemplate.getForObject(URI.create(url), JsonNode.class);
        return response.get("features");
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private double round(double v) {
        return Math.round(v * 10.0) / 10.0;
    }
}
