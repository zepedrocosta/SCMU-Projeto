package fct.project.scmu.dtos.forms.aquariums;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@ToString(doNotUseGetters = true)
public class AquariumForm implements Serializable {

    private String name;

    private String esp;

    private String location;
}
