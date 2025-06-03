package fct.project.scmu.dtos.responses.aquariums;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true)
public class ThresholdResponse {

    private double minTemperature;

    private double maxTemperature;

    private double minPH;

    private double maxPH;

    private int minTds;

    private int maxTds;

    private double minHeight;

    private double maxHeight;

}
