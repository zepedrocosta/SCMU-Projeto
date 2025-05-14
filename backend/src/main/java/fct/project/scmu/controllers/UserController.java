package fct.project.scmu.controllers;

import com.google.common.reflect.TypeToken;
import fct.project.scmu.daos.User;
import fct.project.scmu.dtos.forms.users.*;
import fct.project.scmu.dtos.responses.users.UserResponsePrivilege;
import fct.project.scmu.services.UserService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rest/users")
public class UserController extends AbstractController {

    //TODO: Check email methods
    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResponsePrivilege> create(@Validated @RequestBody UserForm form)
            throws ExecutionException, InterruptedException, MessagingException {
        return ok(userService.create(convert(form, User.class)), UserResponsePrivilege.class);
    }

    @PutMapping("/resendEmail")
    public ResponseEntity<Void> resendEmail(@RequestParam String email) {
        return ok(userService.resendEmail(email));
    }

    @GetMapping("/{nickname}")
    public ResponseEntity<?> get(@PathVariable String nickname)
            throws ExecutionException, InterruptedException {
        var user = userService.get(nickname);
        return ok(user, UserResponsePrivilege.class);
    }

    @PutMapping("/{nickname}")
    @PreAuthorize("hasAnyRole('ADMIN') or authentication.principal.nickname == #form.nickname")
    public ResponseEntity<UserResponsePrivilege> edit(@Validated @RequestPart EditUserForm form,
                                                      @RequestPart(required = false) MultipartFile profilePic) throws ExecutionException, InterruptedException {
        return ok(userService.edit(form, profilePic), UserResponsePrivilege.class);
    }

    @DeleteMapping("/{nickname}")
    @PreAuthorize("hasAnyRole('ADMIN') or authentication.principal.nickname == #nickname")
    public ResponseEntity<Void> delete(@PathVariable String nickname) throws ExecutionException, InterruptedException {
        return ok(userService.delete(nickname));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    @SneakyThrows
    public ResponseEntity<Page<UserResponsePrivilege>> list(@RequestParam(defaultValue = "") String query, @RequestParam(defaultValue = "0") Integer page,
                                                            @RequestParam(defaultValue = "10") Integer size) {
        var token = new TypeToken<List<UserResponsePrivilege>>() {
        }.getType();
        Page<User> result = userService.list(query, page, size).get();
        Page<UserResponsePrivilege> res = new PageImpl<>(convert(result.getContent(), token), result.getPageable(),
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
    public ResponseEntity<UserResponsePrivilege> changeRole(@Validated @RequestBody ChangeRoleForm form) {
        return ok(userService.changeRole(form), UserResponsePrivilege.class);
    }

    @PutMapping("/status")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<UserResponsePrivilege> changeStatus(@Validated @RequestBody ChangeStatusForm form) {
        return ok(userService.changeStatus(form), UserResponsePrivilege.class);
    }

    @PutMapping("/password")
    @PreAuthorize("authentication.principal.nickname == #form.nickname")
    public ResponseEntity<UserResponsePrivilege> changePassword(@Validated @RequestBody ChangePasswordForm form) {
        return ok(userService.changePassword(form), UserResponsePrivilege.class);
    }

    @PutMapping("/request-email")
    public ResponseEntity<UserResponsePrivilege> requestEmail(@RequestParam String email) {
        return ok(userService.requestEmail(email), UserResponsePrivilege.class);
    }

    @PutMapping("/change-email/{verifyHash}")
    public ResponseEntity<UserResponsePrivilege> changeEmail(@PathVariable String verifyHash) {
        return ok(userService.changeEmail(verifyHash), UserResponsePrivilege.class);
    }

    @PutMapping("/forgot-password/{email}")
    public ResponseEntity<UserResponsePrivilege> forgotPasswordEmail(@PathVariable String email) {
        return ok(userService.forgotPasswordEmail(email), UserResponsePrivilege.class);
    }

    @PutMapping("/forgot-password")
    public ResponseEntity<UserResponsePrivilege> changeForgottenPassword(
            @Validated @RequestBody ForgotPasswordForm form) {
        return ok(userService.changeForgottenPassword(form), UserResponsePrivilege.class);
    }

    @PutMapping("/activate/{verifyHash}")
    public ResponseEntity<UserResponsePrivilege> activateAccount(@PathVariable String verifyHash) {
        return ok(userService.activateAccount(verifyHash), UserResponsePrivilege.class);
    }

}
