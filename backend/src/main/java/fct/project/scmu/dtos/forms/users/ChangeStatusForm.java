package fct.project.scmu.dtos.forms.users;

import fct.project.scmu.daos.enums.UserStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@ToString(doNotUseGetters = true)
public class ChangeStatusForm implements Serializable {

    @NotBlank
    private String nickname;

    @NotNull
    private UserStatus status;
}
