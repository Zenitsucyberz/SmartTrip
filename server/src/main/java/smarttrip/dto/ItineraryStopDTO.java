package smarttrip.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItineraryStopDTO {
    private String time;         // e.g. "9:00 AM"
    private String name;         // e.g. "Fort Kochi Beach"
    private String description;  // one or two sentences
    private String address;      // a geocodable address/place name
}
