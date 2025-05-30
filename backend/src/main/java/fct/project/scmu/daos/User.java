package fct.project.scmu.daos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import fct.project.scmu.daos.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.util.Collection;
import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true, callSuper = true)
@EqualsAndHashCode(doNotUseGetters = true, callSuper = true)
@Entity(name = "users")
public class User extends DAO implements UserDetails, Serializable {

    @Column(length = 64, unique = true, nullable = false)
    private String nickname;

    @ToString.Exclude
    private String password;

    @Column(length = 64, nullable = false)
    private String name;

    @Column(length = 64, unique = true, nullable = false)
    private String email;

    @Enumerated
    private UserStatus status = UserStatus.ACTIVE;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToMany(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    private Set<Role> roles;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    @OneToMany(mappedBy = "user",  fetch = FetchType.LAZY)
    private Set<Session> sessions;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "owner", cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    private Set<Aquarium> owns;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToMany(mappedBy = "managers", cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    private Set<Aquarium> manages;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "owner", cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    private Set<Group> groups;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getRole().toUpperCase()))
                .toList();
    }

    /**
     * RETURNS EMAIL, NOT USERNAME
     * @return EMAIL !!!
     */
    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}