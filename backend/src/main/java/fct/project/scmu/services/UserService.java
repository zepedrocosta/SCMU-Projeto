package fct.project.scmu.services;

import fct.project.scmu.daos.User;
import fct.project.scmu.daos.enums.UserStatus;
import fct.project.scmu.dtos.forms.users.*;
import fct.project.scmu.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;


@Service
@RequiredArgsConstructor
public class UserService {

    private final PasswordEncoder encoder;
    private final RoleRepository roles;
    private final UserRepository users;
    private final AquariumRepository aquariums;
    private final ThresholdRepository thresholds;
    private final SensorsSnapshotRepository snapshots;
    private final GroupsRepository groups;

    @Transactional
    public Optional<User> create(User user) {
        var role = roles.findByRole(("USER"));
        if (role == null)
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Role USER not found");

        user.setRoles(Set.of(role));
        user.setPassword(encoder.encode(user.getPassword()));
        user.setEmail(user.getEmail().toLowerCase().trim());
        user.setNickname(user.getNickname().trim());
        var u = users.save(user);

        return Optional.of(u);
    }

    public User get(String nickname) throws ExecutionException, InterruptedException {
        return users.findByNickname(nickname).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @Transactional
    public Optional<User> edit(EditUserForm form) {
        User u = users.findByNickname(form.getNickname())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        u.setName(form.getName());

        return Optional.of(users.save(u));
    }

    @Transactional
    public Optional<Void> delete(String nickname) {
        User u = users.findByNickname(nickname).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        snapshots.deleteAllByAquariumIn(u.getOwns());
        groups.deleteAllByOwner(u);
        thresholds.deleteAllByAquariumIn(u.getOwns());
        aquariums.deleteAllByOwner(u);
        users.delete(u);
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
    public User changeRole(ChangeRoleForm form) {
        User u = users.findByNickname(form.getNickname())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        u.setRoles(form.getRole());

        return users.save(u);
    }

    @Transactional
    public User changeStatus(ChangeStatusForm form) {
        User u = users.findByNickname(form.getNickname())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        u.setStatus(form.getStatus());
        return users.save(u);
    }

    @Transactional
    public User changePassword(ChangePasswordForm form) {
        User u = users.findByNicknameAndStatus(form.getNickname(), UserStatus.ACTIVE)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        u.setPassword(encoder.encode(form.getNewPassword()));

        return users.save(u);
    }

}
