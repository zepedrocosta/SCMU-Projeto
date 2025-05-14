package fct.project.scmu.daos;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Setter
@Getter
@MappedSuperclass
@NoArgsConstructor
@ToString(doNotUseGetters = true)
@EqualsAndHashCode(doNotUseGetters = true)
@EntityListeners(AuditingEntityListener.class)
abstract class DAO {

    @Id
    @GeneratedValue(generator = "uuid2", strategy = GenerationType.AUTO)
    @Column(columnDefinition = "BINARY(16)", unique = true, nullable = false)
    private UUID id;

    @CreatedDate
    private LocalDateTime createdDate;

    @CreatedBy
    private String createdBy;

    @LastModifiedDate
    private LocalDateTime lastModifiedDate;

    @LastModifiedBy
    private String lastModifiedBy;
}
