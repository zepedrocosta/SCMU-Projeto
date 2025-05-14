package fct.project.scmu.dtos.responses.users;

import fct.project.scmu.daos.Role;
import fct.project.scmu.daos.enums.UserStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@ToString(doNotUseGetters = true)
public class UserResponsePrivilege extends UserResponse implements Serializable {

    private String email;

    private String phoneNum;

    private UserStatus status;

    private Role role;

    private String address;

    private String postalCode;

    private String nif;

    private int leafPoints;

    private boolean finishedRegister;
}
