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

    private int level;

    private int levelExp;

    private int levelExpToNextLevel;

    private boolean isPublic;
    
    private String profilePic;

    private String bannerPic;

}
