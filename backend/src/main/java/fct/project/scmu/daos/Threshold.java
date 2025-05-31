package fct.project.scmu.daos;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true, callSuper = true)
@EqualsAndHashCode(doNotUseGetters = true)
@Entity(name = "thresholds")
public class Threshold {

    @Id
    @GeneratedValue(generator = "uuid2", strategy = GenerationType.AUTO)
    @Column(columnDefinition = "BINARY(16)", unique = true, nullable = false)
    private UUID id;

    @Column
    private double minTemperature = 0.0;

    @Column
    private double maxTemperature = 100.0;

    @Column
    private double minPH = 0.0;

    @Column
    private double maxPH = 14.0;

    @Column
    private int minTds = 0;

    @Column
    private int maxTds = 500;

    @Column
    private double minHeight = 0.0;

    @Column
    private double maxHeight = 50.0;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToOne(mappedBy = "threshold")
    private Aquarium aquarium;
}
