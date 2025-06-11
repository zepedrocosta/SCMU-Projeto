package fct.project.scmu.dtos.forms.aquariums;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@NoArgsConstructor
@ToString(doNotUseGetters = true)
public class ManagerForm {

    private String aquariumId;

    private String nickname;
}
