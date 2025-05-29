package fct.project.scmu.dtos.responses.users;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@ToString(doNotUseGetters = true)
public class UserResponse implements Serializable {

    private String nickname;

    private String name;

    private String email;

    private String role;

}
