package fct.project.scmu.daos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.springframework.data.annotation.CreatedDate;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true, callSuper = true)
@EqualsAndHashCode(doNotUseGetters = true)
@Entity(name = "sensorsSnapshot")
@SQLRestriction("is_deleted = false")
@SQLDelete(sql = "UPDATE sensors_snapshot SET is_deleted = true WHERE id = ?")
public class SensorsSnapshot implements Serializable {

    @Id
    @GeneratedValue(generator = "uuid2", strategy = GenerationType.AUTO)
    @Column(columnDefinition = "BINARY(16)", unique = true, nullable = false)
    private UUID id;

    @CreatedDate
    private LocalDateTime createdDate = LocalDateTime.now();

    @Column(nullable = false)
    private double temperature;

    @Column(nullable = false)
    private boolean ldr;

    @Column(nullable = false)
    private double ph;

    @Column(nullable = false)
    private int tds;

    @Column(nullable = false)
    private double height;

    @Column(nullable = false)
    private boolean isDeleted = false;

    @Column(nullable = false)
    private boolean areValuesNormal = true;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "aquariumId")
    private Aquarium aquarium;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToOne(mappedBy = "values")
    private Threshold threshold;
}
