package fct.project.scmu.services;

import fct.project.scmu.daos.Role;
import fct.project.scmu.daos.Session;
import fct.project.scmu.daos.User;
import fct.project.scmu.daos.enums.UserStatus;
import fct.project.scmu.dtos.forms.users.LoginForm;
import fct.project.scmu.repositories.SessionRepository;
import fct.project.scmu.repositories.UserRepository;
import fct.project.scmu.utils.AuthUtils;
import io.jsonwebtoken.impl.DefaultClaims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService implements UserDetailsService {

    private final UserRepository users;

    private final SessionRepository sessions;

    private final PasswordEncoder encoder;

    @Override
    public User loadUserByUsername(String email) throws UsernameNotFoundException {
        return users.findByEmailAndStatus(email.toLowerCase(), UserStatus.ACTIVE).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    public Session loadSession(String id) {
        return sessions.findById(UUID.fromString(id)).orElseThrow( () -> new ResponseStatusException(HttpStatus.FORBIDDEN));
    }

    @Transactional
    public Optional<Void> login(LoginForm login, HttpServletRequest request, HttpServletResponse response) {
        var user = loadUserByUsername(login.getEmail().trim());
        if (!encoder.matches(login.getPassword(), user.getPassword()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        var session = new Session(request.getHeader(HttpHeaders.USER_AGENT), null, user);
        sessions.save(session);
        String roles = user.getRoles().stream()
                .map(Role::getRole)
                .collect(Collectors.joining(","));
        var claims = new HashMap<String, Object>();
        claims.put("email", user.getEmail());
        claims.put("nickname", user.getNickname());
        claims.put("name", user.getName());
        claims.put("role", roles);
        claims.put("agent", request.getHeader(HttpHeaders.USER_AGENT));
        claims.put("jti", session.getId().toString());
        var token = AuthUtils.build(new DefaultClaims(claims));
        response.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + token);
        return Optional.empty();
    }

    @Transactional
    public Optional<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        var token = request.getHeader(HttpHeaders.AUTHORIZATION);
        var claims = AuthUtils.parse(token);
        var session = loadSession( (String) claims.get("jti"));
        session.setEnded(LocalDateTime.now());
        response.setHeader(HttpHeaders.AUTHORIZATION, null);
        sessions.save(session);
        return Optional.empty();
    }


}
