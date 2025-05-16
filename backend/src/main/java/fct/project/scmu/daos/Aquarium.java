package fct.project.scmu.daos;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.*;

import java.io.Serializable;
import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true, callSuper = true)
@EqualsAndHashCode(doNotUseGetters = true, callSuper = true)
@Entity(name = "aquariums")
public class Aquarium extends DAO implements Serializable {

    @Column(length = 64, unique = true, nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    @Column
    private double latitude;

    @Column
    private double longitude;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "aquarium")
    private Set<SensorsSnapshot> values;


}
