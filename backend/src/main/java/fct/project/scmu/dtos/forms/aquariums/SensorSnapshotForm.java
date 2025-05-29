package fct.project.scmu.dtos.forms.aquariums;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@ToString(doNotUseGetters = true)
public class SensorSnapshotForm implements Serializable {

    private double temperature;

    private boolean ldr;

    private double ph;

    private int tds;

    private double height;

    private String aquariumId;

}
