package smarttrip.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItineraryRequestDTO {
    private String area;        // e.g. "Kochi"
    private String duration;    // e.g. "half day", "full day", "3 hours"
    private String interests;   // free text, e.g. "history, local food"
    private int passengers;
}
