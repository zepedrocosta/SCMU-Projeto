package fct.project.scmu.config;

import fct.project.scmu.daos.Role;
import fct.project.scmu.daos.User;
import fct.project.scmu.services.AuthService;
import fct.project.scmu.utils.AuthUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Map;
import java.util.stream.Collectors;

import static fct.project.scmu.config.SecurityConfig.ALLOWED;

/**
 * Filter class for handling session management.
 * It extends Spring's OncePerRequestFilter to ensure that it is executed once per request within a single request thread.
 */
@RequiredArgsConstructor
public class SessionFilter extends OncePerRequestFilter {

    // Service for handling authentication
    private final AuthService authService;

    /**
     * Overrides the doFilterInternal method of OncePerRequestFilter.
     * It checks for an authorization token in the request header, validates it, and sets the authentication in the security context.
     * If the token is not present or invalid, it throws a ResponseStatusException with status UNAUTHORIZED.
     * If an error occurs while validating the token, it throws a ResponseStatusException with status I_AM_A_TEAPOT.
     * The error I_AM_A_TEAPOT is used to be able to easily identify the error in the frontend.
     * @param request the current HTTP request
     * @param response the current HTTP response
     * @param filterChain provides access to the next filter in the chain
     * @throws ServletException in case of errors
     * @throws IOException in case of I/O errors
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        var token = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (token != null){
            // A claim provides a flexible way to encode information about the user's identity,
            // permissions, and additional metadata within the JWT
            Map<String, Object> claims;
            try {
                claims = AuthUtils.parse(token);
            }  catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.I_AM_A_TEAPOT);
            }

            User user;
            try {
                user = authService.loadUserByUsername( (String) claims.get("email"));
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.I_AM_A_TEAPOT);
            }

            var session = authService.loadSession( (String) claims.get("jti"));
            // If the session has ended, throw a ResponseStatusException.
            if (session.getEnded() != null) throw new ResponseStatusException(HttpStatus.I_AM_A_TEAPOT);
            var authentication = new UsernamePasswordAuthenticationToken(user, session, user.getAuthorities());
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String roles = user.getRoles().stream()
                    .map(Role::getRole)
                    .collect(Collectors.joining(","));
            claims.put("role", roles.trim());
            claims.put("nickname", user.getNickname());

            // Renew the token, extending its expiration time.
            token = AuthUtils.renew(claims);
            response.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + token);
            filterChain.doFilter(request, response);
        }
        else throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }

    /**
     * Overrides the shouldNotFilter method of OncePerRequestFilter.
     * It checks if the request matches any of the paths that are allowed to be accessed without authentication.
     * @param request the current HTTP request
     * @return true if the request matches any of the allowed paths, false otherwise
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        for (RequestMatcher permit: ALLOWED) {
            if (permit.matches(request))
                return true;
        }
        return false;
    }
}