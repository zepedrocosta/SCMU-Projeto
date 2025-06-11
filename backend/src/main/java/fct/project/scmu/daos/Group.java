package fct.project.scmu.daos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true, callSuper = true)
@EqualsAndHashCode(doNotUseGetters = true, callSuper = true)
@Entity(name = "aqGroups")
@SQLRestriction("is_deleted = false")
@SQLDelete(sql = "UPDATE aq_groups SET is_deleted = true WHERE id = ?")
public class Group extends DAO{

    @Column(nullable = false)
    private String name;

    @Column
    private boolean isDeleted = false;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToMany(cascade = CascadeType.MERGE)
    private Set<Aquarium> aquariums = new HashSet<>();

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne(cascade = CascadeType.MERGE)
    private User owner;
}
