package fct.project.scmu.daos;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true, callSuper = true)
@EqualsAndHashCode(doNotUseGetters = true, callSuper = true)
@Entity(name = "aqGroups")
@SQLRestriction("is_deleted = false")
@SQLDelete(sql = "UPDATE aquariums SET is_deleted = true WHERE id = ?")
public class Group extends DAO{

    @Column(nullable = false)
    private String name;

    @Column
    private boolean isDeleted = false;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToMany(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    private Set<Aquarium> aquariums;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    private User owner;
}
