package fct.project.scmu.dtos.responses.aquariums;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true)
public class SetSnapshotResponse {

    private boolean isBombWorking;

    private boolean areValuesNormal;
}
