package fct.project.scmu.dtos.forms.users;

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
public class ForgotPasswordForm implements Serializable {

    @NotBlank
    private String verifyHash;

    @NotBlank
    private String newPassword;

    @NotBlank
    private String confirmPassword;
}
