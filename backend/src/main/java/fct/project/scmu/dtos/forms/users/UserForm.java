package fct.project.scmu.dtos.forms.users;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;


@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true)
@EqualsAndHashCode(doNotUseGetters = true)
public class UserForm implements Serializable {

    @NotBlank
    @Size(max = 64)
    private String nickname;

    @NotBlank
    @Size(max = 64)
    private String name;


    @NotBlank
    @Size(max = 64)
    @Email(regexp = ".+@.+\\..+")
    private String email;

    @NotBlank
    @Size(max = 64)
    private String password;

    @NotBlank
    @Size(max = 64)
    private String confirmPassword;

}
