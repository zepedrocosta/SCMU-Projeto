package fct.project.scmu.daos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;


@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true, callSuper = true)
@EqualsAndHashCode(doNotUseGetters = true, callSuper = true)
@Entity(name = "roles")
public class Role extends DAO {

    @Column(length = 64, unique = true, nullable = false)
    private String role;

    private String description;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToMany(mappedBy = "roles", cascade = CascadeType.MERGE)
    private Set<User> users = new HashSet<>();
}