package fct.project.scmu.services;

import fct.project.scmu.daos.User;
import fct.project.scmu.daos.enums.UserStatus;
import fct.project.scmu.dtos.forms.users.*;
import fct.project.scmu.repositories.UserRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import static fct.project.scmu.config.RedisConfig.USERS;


@Service
@RequiredArgsConstructor
public class UserService {

    private final PasswordEncoder encoder;

    private final UserRepository users;

    private final EmailService email;

    @Transactional
    public Optional<User> create(User user)
            throws ExecutionException, InterruptedException, MessagingException {

        user.setPassword(encoder.encode(user.getPassword()));
        user.setEmail(user.getEmail().toLowerCase().trim());
        user.setNickname(user.getNickname().trim());
        var u = users.save(user);

        email.sendHashEmail(user, "welcomeEmail", "Welcome to Treap!");
        return Optional.of(u);
    }

    public Optional<Void> resendEmail(String email) {
        var u = users.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        this.email.sendHashEmail(u, "welcomeEmail", "Welcome to Treap!");
        return Optional.empty();
    }

    @Cacheable(value = USERS, key = "#nickname")
    public User get(String nickname) throws ExecutionException, InterruptedException {
        return users.findByNickname(nickname).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @Transactional
    @CacheEvict(value = USERS, key = "#form.nickname")
    public Optional<User> edit(EditUserForm form, MultipartFile profilePic)
            throws ExecutionException, InterruptedException {
        User u = users.findByNickname(form.getNickname())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        u.setName(form.getName());
        u.setPhoneNum(form.getPhoneNum());

        return Optional.of(users.save(u));
    }

    @Transactional
    @CacheEvict(value = USERS, key = "#nickname")
    public Optional<Void> delete(String nickname) throws ExecutionException, InterruptedException {
        User u = users.findByNickname(nickname).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return Optional.empty();
    }

    @Async
    public Future<Page<User>> list(String query, Integer page, Integer size) {
        var pageable = PageRequest.of(page, size);
        Page<User> res;
        if (query != null && !query.isEmpty())
            res = users.findByNicknameLike(query, pageable);
        else
            res = users.findAll(pageable);
        return CompletableFuture.completedFuture(res);
    }

    //TODO: Implement this
    @Async
    public Future<List<String>> search(String query) {
        /*
        String end = query + "\uFFFF";
        var pageable = PageRequest.of(0, 10);
        var lu = users.findByNicknameLike2(query, end, pageable);
        return CompletableFuture.completedFuture(new ArrayList<>(lu.stream().limit(10).map(User::getNickname).toList()));
         */
        return CompletableFuture.completedFuture(new ArrayList<>());
    }

    @Transactional
    @CacheEvict(value = USERS, key = "#form.nickname")
    public User changeRole(ChangeRoleForm form) {
        User u = users.findByNickname(form.getNickname())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        u.setRoles(form.getRole());

        return users.save(u);
    }

    @Transactional
    @CacheEvict(value = USERS, key = "#form.nickname")
    public User changeStatus(ChangeStatusForm form) {
        User u = users.findByNickname(form.getNickname())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        u.setStatus(form.getStatus());
        return users.save(u);
    }

    @Transactional
    @CacheEvict(value = USERS, key = "#form.nickname")
    public User changePassword(ChangePasswordForm form) {
        User u = users.findByNicknameAndStatus(form.getNickname(), UserStatus.ACTIVE)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        u.setPassword(encoder.encode(form.getNewPassword()));

        return users.save(u);
    }

    //TODO: Check implementation
    @Transactional
    @CacheEvict(value = USERS, key = "#result.nickname")
    public User requestEmail(String email) {

        if (!email.matches(".+@.+\\..+"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

        if (users.existsByEmail(email.toLowerCase()))
            throw new ResponseStatusException(HttpStatus.CONFLICT);

        var u = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var oldEmail = u.getEmail();

        var hash = new BigInteger(650, new SecureRandom()).toString(16);
        u.setVerifyHash(hash);
        users.save(u);

        this.email.sendNotificationEmail(u.getNickname(), oldEmail, email.toLowerCase(), "notifyEmailChange", "An email change was requested");
        u.setEmail(email.toLowerCase());
        this.email.sendHashEmail(u, "changeEmail", "Email change request");

        return u;
    }

    //TODO: Implement this
    @Transactional
    public User changeEmail(String verifyHash) {
        return null;
    }

    @Transactional
    @CacheEvict(value = USERS, key = "#result.nickname")
    public User forgotPasswordEmail(String to) {
        User u = users.findByEmail(to)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        u.setVerifyHash(new BigInteger(650, new SecureRandom()).toString(32));
        users.save(u);
        email.sendHashEmail(u, "forgotPasswordEmail", "Password Reset");

        return u;
    }

    @Transactional
    @CacheEvict(value = USERS, key = "#result.nickname")
    public User changeForgottenPassword(ForgotPasswordForm form) {
        User u = users.findByVerifyHash(form.getVerifyHash())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        u.setPassword(encoder.encode(form.getNewPassword()));
        u.setVerifyHash("");

        return users.save(u);
    }

    @Transactional
    public User activateAccount(String verifyHash) {
        User u = users.findByVerifyHash(verifyHash)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        u.setStatus(UserStatus.ACTIVE);
        u.setVerifyHash("");

        return users.save(u);
    }

}
