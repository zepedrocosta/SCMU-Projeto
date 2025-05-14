package fct.project.scmu.controllers;

import fct.project.scmu.dtos.forms.users.LoginForm;
import fct.project.scmu.services.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rest/security")
public class SecurityController extends AbstractController {

    private final AuthService authService;

    @PutMapping
    public ResponseEntity<Void> login(@Validated @RequestBody LoginForm login,
                                      HttpServletRequest request, HttpServletResponse response) {
        return ok(authService.login(login, request, response));
    }

    @DeleteMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        return ok(authService.logout(request, response));
    }
}