package fct.project.scmu.dtos.responses.aquariums;

import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true)
public class PrivAquariumResponse {

    private String id;

    private String name;

    private String location;

    private boolean isBombWorking;

    private LocalDateTime createdDate;

    private String createdBy;

    private ThresholdResponse threshold;


}
