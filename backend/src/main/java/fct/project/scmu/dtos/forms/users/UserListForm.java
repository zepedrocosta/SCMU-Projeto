package fct.project.scmu.dtos.forms.users;

import fct.project.scmu.daos.enums.UserStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@ToString(doNotUseGetters = true)
public class UserListForm implements Serializable {
    // Search list

    @NotBlank
    private String nickname;

    @NotBlank
    private String name;

    @NotBlank
    private String email;

    @NotBlank
    private UserStatus status;

}
