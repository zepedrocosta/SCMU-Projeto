package fct.project.scmu.daos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true, callSuper = true)
@EqualsAndHashCode(doNotUseGetters = true)
@Entity(name = "thresholds")
@SQLRestriction("is_deleted = false")
@SQLDelete(sql = "UPDATE aquariums SET is_deleted = true WHERE id = ?")
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

    @Column
    private boolean isDeleted = false;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.EAGER)
    @JsonBackReference
    private Aquarium aquarium;
}
