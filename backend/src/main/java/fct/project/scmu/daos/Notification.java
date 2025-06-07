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
@ToString(doNotUseGetters = true)
@EqualsAndHashCode(doNotUseGetters = true, callSuper = true)
@Entity(name = "notifications")
@SQLRestriction("is_deleted = false AND is_read = false")
@SQLDelete(sql = "UPDATE notifications SET is_deleted = true WHERE id = ?")
public class Notification extends DAO {

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private boolean isRead = false;

    @Column
    private boolean isDeleted = false;

    @Column(nullable = false)
    private String snapshotId;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToMany(mappedBy = "notifications", cascade = CascadeType.MERGE)
    private Set<User> users;
}
