package fct.project.scmu.dtos.responses.aquariums;

import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true)
public class NotificationResponse {

    private String id;

    private String message;

    private LocalDateTime createdDate;

    private String snapshotId;

    private String aquariumId;
}
