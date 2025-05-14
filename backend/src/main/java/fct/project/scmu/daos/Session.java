package fct.project.scmu.daos;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true, callSuper = true)
@EqualsAndHashCode(doNotUseGetters = true, callSuper = true)
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Entity(name = "sessions")
public class Session extends DAO implements Serializable {

    @Column(nullable = false)
    private String agent;

    private LocalDateTime ended;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne(cascade = {CascadeType.MERGE})
    @JoinColumn(name = "user_id")
    private User user;
}
