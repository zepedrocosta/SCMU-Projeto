package fct.project.scmu.dtos.responses.aquariums;

import fct.project.scmu.daos.Threshold;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@ToString
@EqualsAndHashCode
public class ThresholdSnapshot {

    @Column
    private double minTemperature;

    @Column
    private double maxTemperature;

    @Column
    private double minPH;

    @Column
    private double maxPH;

    @Column
    private int minTds;

    @Column
    private int maxTds;

    @Column
    private double minHeight;

    @Column
    private double maxHeight;

    public ThresholdSnapshot(Threshold threshold) {
        this.minTemperature = threshold.getMinTemperature();
        this.maxTemperature = threshold.getMaxTemperature();
        this.minPH = threshold.getMinPH();
        this.maxPH = threshold.getMaxPH();
        this.minTds = threshold.getMinTds();
        this.maxTds = threshold.getMaxTds();
        this.minHeight = threshold.getMinHeight();
        this.maxHeight = threshold.getMaxHeight();
    }
}
