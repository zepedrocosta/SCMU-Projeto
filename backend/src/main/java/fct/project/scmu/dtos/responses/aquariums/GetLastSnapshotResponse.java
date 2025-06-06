package fct.project.scmu.dtos.responses.aquariums;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true)
public class GetLastSnapshotResponse {

    private String id;

    private double temperature;

    private boolean ldr;

    private double ph;

    private int tds;

    private double height;

    private boolean isBombWorking;
}
