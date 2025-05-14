package fct.project.scmu.services;

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

        //Removing this comment will make the user unable to login if he already has an active session

        /*if (sessions.existsByUserAndEndedIsNull(user.getId())) {
            var session = sessions.findByUserAndEndedIsNull(user.getId()).get();
            session.setEnded(LocalDateTime.now());
            sessions.save(session);
        }*/

        var session = new Session(request.getHeader(HttpHeaders.USER_AGENT), null, user);
        sessions.save(session);
        var claims = new HashMap<String, Object>();
        claims.put("email", user.getEmail());
        claims.put("nickname", user.getNickname());
        claims.put("role", user.getRoles().toString());
        claims.put("agent", request.getHeader(HttpHeaders.USER_AGENT));
        claims.put("ip", request.getHeader("X-FORWARDED-FOR")); //TODO: Check if this is the correct header
        claims.put("jti", session.getId());
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
