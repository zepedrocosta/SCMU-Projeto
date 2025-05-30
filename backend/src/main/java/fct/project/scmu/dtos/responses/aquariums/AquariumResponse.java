package fct.project.scmu.dtos.responses.aquariums;

import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true)
public class AquariumResponse implements Serializable {

    private String id;

    private String name;

    private String location;

    private LocalDateTime createdDate;

    private String createdBy;
}
