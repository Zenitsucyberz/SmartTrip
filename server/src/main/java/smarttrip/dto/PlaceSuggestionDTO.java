package smarttrip.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaceSuggestionDTO {
    private String label;
    private double lat;
    private double lon;
}
