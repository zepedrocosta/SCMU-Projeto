package fct.project.scmu.dtos.forms.users;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@ToString(doNotUseGetters = true)
public class EditUserForm implements Serializable {

    @Size(max = 64)
    private String nickname;

    @Size(max = 64)
    private String name;

}
