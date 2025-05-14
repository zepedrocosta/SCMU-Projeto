package fct.project.scmu.dtos.forms.users;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@ToString(doNotUseGetters = true)
@EqualsAndHashCode(doNotUseGetters = true)
public class LoginForm implements Serializable {

    @NotBlank
    @Size(max = 64)
    private String email;

    @NotBlank
    @Size(max = 64)
    private String password;

}
