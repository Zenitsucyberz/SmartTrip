package smarttrip.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import smarttrip.dto.ItineraryRequestDTO;
import smarttrip.dto.ItineraryStopDTO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class GeminiService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.model:gemini-flash-latest}")
    private String model;

    public List<ItineraryStopDTO> planItinerary(ItineraryRequestDTO request) {

        if (apiKey == null || apiKey.isBlank()) {
            throw new RuntimeException(
                    "AI itinerary planner isn't configured yet - add gemini.api.key in application.properties");
        }
        if (request.getArea() == null || request.getArea().isBlank()) {
            throw new RuntimeException("Tell me which area/city you want an itinerary for");
        }

        String prompt = buildPrompt(request);

        String url = "https://generativelanguage.googleapis.com/v1beta/models/"
                + model + ":generateContent?key=" + apiKey;

        var body = new java.util.HashMap<String, Object>();
        body.put("contents", List.of(
                java.util.Map.of("parts", List.of(java.util.Map.of("text", prompt)))
        ));
        body.put("generationConfig", java.util.Map.of("responseMimeType", "application/json"));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Object> entity = new HttpEntity<>(body, headers);

        JsonNode response;
        try {
            response = restTemplate.postForObject(url, entity, JsonNode.class);
        } catch (Exception e) {
            throw new RuntimeException("Could not reach the AI planner: " + e.getMessage());
        }

        String text = extractText(response);
        return parseStops(text);
    }

    private String buildPrompt(ItineraryRequestDTO request) {
        return "You are a local trip planner. Create a realistic day itinerary.\n"
                + "Area/city: " + request.getArea() + "\n"
                + "Duration: " + (request.getDuration() == null || request.getDuration().isBlank() ? "half day" : request.getDuration()) + "\n"
                + "Interests: " + (request.getInterests() == null || request.getInterests().isBlank() ? "general sightseeing" : request.getInterests()) + "\n"
                + "Passengers: " + (request.getPassengers() > 0 ? request.getPassengers() : 1) + "\n\n"
                + "Return 3 to 6 stops as a JSON array. Each element must have exactly these fields: "
                + "\"time\" (short clock time like \"9:00 AM\"), \"name\" (short place name), "
                + "\"description\" (one short sentence, max 20 words), and \"address\" "
                + "(a landmark-style address a mapping service can geocode: the place or street name "
                + "plus the city/region and country, e.g. \"Fort Kochi Beach, Kochi, India\" - do NOT "
                + "include building/unit numbers or postal codes, since general-purpose geocoders often "
                + "fail on those even when the landmark itself is well known). "
                + "Order stops chronologically and keep travel between them realistic for the given area. "
                + "Return ONLY the JSON array, no other text.";
    }

    private String extractText(JsonNode response) {
        if (response == null || !response.has("candidates") || response.get("candidates").isEmpty()) {
            String blockReason = response != null && response.has("promptFeedback")
                    ? response.get("promptFeedback").toString() : "empty response";
            throw new RuntimeException("The AI planner returned nothing usable (" + blockReason + ")");
        }

        JsonNode candidate = response.get("candidates").get(0);
        JsonNode parts = candidate.path("content").path("parts");
        if (!parts.isArray() || parts.isEmpty()) {
            throw new RuntimeException("The AI planner's response had no content - try again");
        }

        return parts.get(0).path("text").asText();
    }

    private List<ItineraryStopDTO> parseStops(String text) {
        // Defensive: strip markdown code fences in case the model adds them
        // despite responseMimeType being set to JSON.
        String cleaned = text.trim();
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceFirst("^```[a-zA-Z]*\\s*", "").replaceFirst("```\\s*$", "");
        }

        try {
            ItineraryStopDTO[] stops = mapper.readValue(cleaned, ItineraryStopDTO[].class);
            if (stops.length == 0) {
                throw new RuntimeException("The AI planner didn't suggest any stops - try rephrasing your request");
            }
            return List.of(stops);
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            throw new RuntimeException("The AI planner's response wasn't valid - please try again");
        }
    }
}
