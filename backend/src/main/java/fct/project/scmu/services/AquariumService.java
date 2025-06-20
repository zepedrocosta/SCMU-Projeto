package fct.project.scmu.services;

import fct.project.scmu.daos.*;
import fct.project.scmu.dtos.forms.aquariums.EditAquariumForm;
import fct.project.scmu.dtos.forms.aquariums.ManagerForm;
import fct.project.scmu.dtos.forms.aquariums.ThresholdForm;
import fct.project.scmu.dtos.responses.aquariums.*;
import fct.project.scmu.repositories.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Future;
import java.util.stream.Stream;

@Service
@Slf4j
@RequiredArgsConstructor
public class AquariumService {

    private final AquariumRepository aquariums;
    private final SensorsSnapshotRepository snapshots;
    private final UserRepository users;
    private final GroupsRepository groups;
    private final ThresholdRepository thresholds;
    private final NotificationRepository notifications;

    @Transactional
    public SetSnapshotResponse storeSnapshot(SensorsSnapshot snapshot, String esp) {
        var response = aquariums.findByEsp(esp);
        if (response.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        var aquarium = response.get();
        var isBombWorking = aquarium.isBombWorking();
        snapshot.setAquarium(aquarium);
        snapshot.setThreshold(new ThresholdSnapshot(aquarium.getThreshold()));
        snapshot.setBombWorking(isBombWorking);
        snapshots.save(snapshot);

        var threshold = aquarium.getThreshold();
        var exceedsThreshold = false;
        List<String> params = new ArrayList<>();

        log.info("Snapshot: {}", snapshot);

        log.info("Threshold: {}", threshold);

        if (snapshot.getTemperature() < threshold.getMinTemperature() || snapshot.getTemperature() > threshold.getMaxTemperature()) {
            exceedsThreshold = true;
            params.add("temperature");
        }

        if (!snapshot.isLdr()) {
            exceedsThreshold = true;
            params.add("ldr");
        }

        if (snapshot.getPh() < threshold.getMinPH() || snapshot.getPh() > threshold.getMaxPH()) {
            exceedsThreshold = true;
            params.add("ph");
        }

        if (snapshot.getTds() < threshold.getMinTds() || snapshot.getTds() > threshold.getMaxTds()) {
            aquarium.setBombWorking(true);
            exceedsThreshold = true;
            aquarium = aquariums.save(aquarium);
            params.add("tds");
        }

        if (snapshot.getHeight() < threshold.getMinHeight() || snapshot.getHeight() > threshold.getMaxHeight()) {
            exceedsThreshold = true;
            params.add("height");
        }

        if (exceedsThreshold) {
            var notification = new Notification();
            notification.setMessage(String.join(", ", params));
            var owner = aquarium.getOwner();
            var managers = aquarium.getManagers();
            var totalUsers = new HashSet<>(Stream.concat(managers.stream(), Stream.of(owner)).toList());
            notification.setUsers(totalUsers);
            notification.setSnapshotId(snapshot.getId().toString());
            notification.setAquariumId(aquarium.getId().toString());
            notifications.save(notification);
            for (var user : totalUsers) {
                user.getNotifications().add(notification);
                users.save(user);
            }
        }

        snapshot.setAreValuesNormal(!exceedsThreshold);
        snapshots.save(snapshot);

        return new SetSnapshotResponse(isBombWorking, !exceedsThreshold);
    }

    public SensorsSnapshot getLastSnapshot(String aquariumId) {
        var res = aquariums.findById(UUID.fromString(aquariumId));
        if (res.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        var aquarium = res.get();
        var lastRes = snapshots.findFirstByAquariumOrderByCreatedDateDesc(aquarium);
        if (lastRes.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);

        return lastRes.get();
    }

    @Async
    public Future<Page<SensorsSnapshot>> getSnapshots(String aquariumId, LocalDateTime date, int page, int size) {
        var pageable = PageRequest.of(page, size);
        var res = aquariums.findById(UUID.fromString(aquariumId));
        if (res.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        var aquarium = res.get();
        return CompletableFuture.completedFuture(
                snapshots.findAllByAquariumOrderByCreatedDateDesc(aquarium, pageable));

    }

    @Transactional
    public Aquarium createAquarium(Aquarium aquarium) {
        if (aquariums.existsByEsp(aquarium.getEsp()))
            throw new ResponseStatusException(HttpStatus.CONFLICT);

        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var threshold = new Threshold();
        aquarium.setOwner(principal);
        aquarium.setThreshold(threshold);
        threshold.setAquarium(aquarium);

        thresholds.save(threshold);
        return aquariums.save(aquarium);
    }

    public Optional<Aquarium> getAquarium(String id) {
        var res = aquariums.findById(UUID.fromString(id));
        checkPermission(res);

        return Optional.of(res.get());
    }

    @Transactional
    public Aquarium updateAquarium(EditAquariumForm form) {
        var res = aquariums.findById(UUID.fromString(form.getId()));
        var aquarium = checkPermission(res);

        aquarium.setName(form.getName());
        aquarium.setLocation(form.getLocation());

        return aquariums.save(aquarium);
    }

    @Transactional
    public Optional<Void> deleteAquarium(String aquariumId) {
        var res = aquariums.findById(UUID.fromString(aquariumId));
        var aquarium = checkPermission(res);

        var u = aquarium.getOwner();
        snapshots.deleteAllByAquariumIn(u.getOwns());
        thresholds.deleteAllByAquariumIn(u.getOwns());
        aquariums.deleteByOwner(u);

        return Optional.empty();
    }

    @Async
    public Future<List<Aquarium>> listAquariums() {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return CompletableFuture.completedFuture(aquariums.list(principal));
    }

    @Transactional
    public Group createGroup(String groupName) {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return groups.save(new Group(groupName, false, new HashSet<>(), principal));
    }

    @Transactional
    public Optional<Void> deleteGroup(String groupId) {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var groupRes = groups.findById(UUID.fromString(groupId));
        if (groupRes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        var group = groupRes.get();

        if (!group.getOwner().getId().equals(principal.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        groups.delete(group);
        return Optional.empty();
    }

    public List<Group> listGroups() {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return groups.findAllByOwner(principal);
    }

    @Async
    public Future<Page<Aquarium>> searchAquariums(String query, int page, int size) {
        var pageable = PageRequest.of(page, size);
        return CompletableFuture.completedFuture(aquariums.search(query, pageable));
    }

    @Transactional
    public boolean bombAquarium(String aquariumId) {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var aquariumRes = aquariums.findById(UUID.fromString(aquariumId));
        if (aquariumRes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        var aquarium = aquariumRes.get();

        if (!aquariums.existsByIdAndOwner(aquarium.getId(), principal)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        var state = aquarium.isBombWorking();
        aquarium.setBombWorking(!state);
        aquariums.save(aquarium);
        return !state;
    }

    @Transactional
    public Aquarium addAquariumToGroup(String groupId, String aquariumId) {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var groupRes = groups.findById(UUID.fromString(groupId));
        if (groupRes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        var group = groupRes.get();

        var aquariumRes = aquariums.findById(UUID.fromString(aquariumId));
        if (aquariumRes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        var aquarium = aquariumRes.get();

        if (!groups.existsByIdAndOwner(group.getId(), principal)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        if (group.getAquariums().contains(aquarium)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }

        group.getAquariums().add(aquarium);
        aquarium.getGroups().add(group);
        groups.save(group);

        return aquariums.save(aquarium);
    }

    @Transactional
    public Optional<Void> removeAquariumFromGroup(String groupId, String aquariumId) {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var groupRes = groups.findById(UUID.fromString(groupId));
        if (groupRes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        var group = groupRes.get();

        var aquariumRes = aquariums.findById(UUID.fromString(aquariumId));
        if (aquariumRes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        var aquarium = aquariumRes.get();

        if (!groups.existsByIdAndOwner(group.getId(), principal)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        if (!group.getAquariums().contains(aquarium)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        group.getAquariums().remove(aquarium);
        aquarium.getGroups().remove(group);
        groups.save(group);
        aquariums.save(aquarium);

        return Optional.empty();
    }

    public List<Aquarium> getAquariumsInGroup(String groupId) {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var groupRes = groups.findById(UUID.fromString(groupId));
        if (groupRes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        var group = groupRes.get();

        if (!groups.existsByIdAndOwner(group.getId(), principal)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        return group.getAquariums().stream().toList();
    }

    @Transactional
    public List<String> addManager(ManagerForm form) {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var aquariumRes = aquariums.findById(UUID.fromString(form.getAquariumId()));
        if (aquariumRes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        var aquarium = aquariumRes.get();

        if (!aquariums.existsByIdAndOwner(aquarium.getId(), principal)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        var userRes = users.findByNickname(form.getNickname());
        if (userRes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        var user = userRes.get();

        if (aquariums.isUserManagerOrOwner(aquarium, user)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }

        aquarium.getManagers().add(user);
        aquariums.save(aquarium);

        return aquarium.getManagers().stream()
                .map(User::getNickname)
                .toList();
    }

    @Transactional
    public List<String> removeManager(ManagerForm form) {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var aquariumRes = aquariums.findById(UUID.fromString(form.getAquariumId()));
        if (aquariumRes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        var aquarium = aquariumRes.get();

        if (!aquariums.existsByIdAndOwner(aquarium.getId(), principal)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        var userRes = users.findByNickname(form.getNickname());
        if (userRes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        var user = userRes.get();

        if (!aquarium.getManagers().contains(user)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        aquarium.getManagers().remove(user);
        aquariums.save(aquarium);

        return aquarium.getManagers().stream()
                .map(User::getNickname)
                .toList();
    }


    @Transactional
    public Threshold editThreshold(ThresholdForm form) {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var aquarium = aquariums.findById(UUID.fromString(form.getAquariumId()));

        if (aquarium.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        if (!aquariums.existsByIdAndOwner(aquarium.get().getId(), principal)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        var threshold = aquarium.get().getThreshold();
        threshold.setMinTemperature(form.getMinTemperature());
        threshold.setMaxTemperature(form.getMaxTemperature());
        threshold.setMinPH(form.getMinPH());
        threshold.setMaxPH(form.getMaxPH());
        threshold.setMinTds(form.getMinTds());
        threshold.setMaxTds(form.getMaxTds());
        threshold.setMinHeight(form.getMinHeight());
        threshold.setMaxHeight(form.getMaxHeight());


        return thresholds.save(threshold);
    }

    @Async
    @Transactional
    public Future<List<Notification>> fetchNotifications(LocalDateTime startDate) {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        var res = notifications.fetch(principal.getId(), startDate);
        return CompletableFuture.completedFuture(res);
    }

    private Aquarium checkPermission(Optional<Aquarium> res) {
        if (res.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        var aquarium = res.get();
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!aquariums.existsByIdAndOwner(aquarium.getId(), principal))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        return aquarium;
    }
}
