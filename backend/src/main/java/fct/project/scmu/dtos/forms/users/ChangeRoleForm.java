package fct.project.scmu.dtos.forms.users;

import fct.project.scmu.daos.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@ToString(doNotUseGetters = true)
public class ChangeRoleForm implements Serializable {

    @NotBlank
    @Size(max = 64)
    private String nickname;

    @NotNull
    private Set<Role> role;
}
