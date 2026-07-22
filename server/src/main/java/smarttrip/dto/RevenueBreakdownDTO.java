package smarttrip.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RevenueBreakdownDTO {
    private List<RevenuePointDTO> monthly; // 12 months of current year
    private List<RevenuePointDTO> annual;  // per year
}
