package fct.project.scmu.daos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
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
    private boolean isBombWorking = false;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne
    @JsonBackReference
    private User owner;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "aquarium", cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    private Set<SensorsSnapshot> values;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToMany(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    private Set<User> managers;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToMany(mappedBy = "aquariums", cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    private Set<Group> groups;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToOne
    private Threshold threshold;
}
