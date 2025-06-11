package fct.project.scmu.dtos.forms.aquariums;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@NoArgsConstructor
@ToString(doNotUseGetters = true)
public class AquariumToGroupForm {

    private String groupId;

    private String aquariumId;
}
