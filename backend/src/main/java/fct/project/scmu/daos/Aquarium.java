package fct.project.scmu.daos;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true, callSuper = true)
@EqualsAndHashCode(doNotUseGetters = true, callSuper = true)
@Entity(name = "aquariums")
@SQLRestriction("is_deleted = false")
@SQLDelete(sql = "UPDATE aquariums SET is_deleted = true WHERE id = ?")
public class Aquarium extends DAO implements Serializable {

    @Column(length = 64, nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false, unique = true)
    private String esp;

    @Column
    private boolean isBombWorking = false;

    @Column
    private boolean isDeleted = false;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    private User owner;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "aquarium", cascade = CascadeType.MERGE)
    private Set<SensorsSnapshot> values = new HashSet<>();

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToMany(cascade = CascadeType.MERGE)
    private Set<User> managers = new HashSet<>();

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToMany(mappedBy = "aquariums", cascade = CascadeType.MERGE)
    private Set<Group> groups = new HashSet<>();

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToOne(mappedBy = "aquarium")
    private Threshold threshold;
}
