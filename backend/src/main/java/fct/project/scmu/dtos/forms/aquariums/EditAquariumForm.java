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
public class EditAquariumForm implements Serializable {

    private String id;

    private String name;

    private String location;
}
