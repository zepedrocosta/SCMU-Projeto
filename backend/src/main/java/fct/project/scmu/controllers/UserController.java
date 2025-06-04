package fct.project.scmu.controllers;

import com.google.common.reflect.TypeToken;
import fct.project.scmu.daos.User;
import fct.project.scmu.dtos.forms.users.*;
import fct.project.scmu.dtos.responses.users.UserResponse;
import fct.project.scmu.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rest/users")
public class UserController extends AbstractController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResponse> create(@Validated @RequestBody UserForm form) {
        return ok(userService.create(convert(form, User.class)), UserResponse.class);
    }

    @SneakyThrows
    @GetMapping("/{nickname}")
    public ResponseEntity<UserResponse> get(@PathVariable String nickname) {
        var user = userService.get(nickname);
        return ok(user, UserResponse.class);
    }

    @PutMapping("/{nickname}")
    @PreAuthorize("hasAnyRole('ADMIN') or authentication.principal.nickname == #form.nickname")
    public ResponseEntity<UserResponse> edit(@RequestBody EditUserForm form) {
        return ok(userService.edit(form), UserResponse.class);
    }

    @DeleteMapping("/{nickname}")
    @PreAuthorize("hasAnyRole('ADMIN') or authentication.principal.nickname == #nickname")
    public ResponseEntity<Void> delete(@PathVariable String nickname) throws ExecutionException, InterruptedException {
        return ok(userService.delete(nickname));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    @SneakyThrows
    public ResponseEntity<Page<UserResponse>> list(@RequestParam(defaultValue = "") String query, @RequestParam(defaultValue = "0") Integer page,
                                                            @RequestParam(defaultValue = "10") Integer size) {
        var token = new TypeToken<List<UserResponse>>() {
        }.getType();
        Page<User> result = userService.list(query, page, size).get();
        Page<UserResponse> res = new PageImpl<>(convert(result.getContent(), token), result.getPageable(),
                result.getTotalElements());
        return ok(res);
    }

    @GetMapping("/search/{query}")
    @SneakyThrows
    public ResponseEntity<List<String>> search(@PathVariable String query) {
        return ok(userService.search(query).get());
    }

    @PutMapping("/role")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<UserResponse> changeRole(@Validated @RequestBody ChangeRoleForm form) {
        return ok(userService.changeRole(form), UserResponse.class);
    }

    @PutMapping("/status")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<UserResponse> changeStatus(@Validated @RequestBody ChangeStatusForm form) {
        return ok(userService.changeStatus(form), UserResponse.class);
    }

    @PutMapping("/password")
    @PreAuthorize("authentication.principal.nickname == #form.nickname")
    public ResponseEntity<UserResponse> changePassword(@Validated @RequestBody ChangePasswordForm form) {
        return ok(userService.changePassword(form), UserResponse.class);
    }

}
