package fct.project.scmu.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import fct.project.scmu.daos.*;
import fct.project.scmu.dtos.forms.aquariums.EditAquariumForm;
import fct.project.scmu.dtos.forms.aquariums.ThresholdForm;
import fct.project.scmu.dtos.responses.aquariums.*;
import fct.project.scmu.repositories.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Future;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class AquariumService {

    private final AquariumRepository aquariums;
    private final SensorsSnapshotRepository snapshots;
    private final UserRepository users;
    private final GroupsRepository groups;
    private final ThresholdRepository thresholds;
    private final ObjectMapper objectMapper;

    @Transactional
    public SnapshotResponse storeSnapshot(SensorsSnapshot snapshot, String aquariumId) {
        var response = aquariums.findById(UUID.fromString(aquariumId));
        if (response.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        var aquarium = response.get();
        snapshot.setAquarium(aquarium);
        snapshots.save(snapshot);

        var threshold = aquarium.getThreshold();
        var exceedsThreshold = false;

        if (snapshot.getTemperature() < threshold.getMinTemperature() || snapshot.getTemperature() > threshold.getMaxTemperature()) {
            exceedsThreshold = true;
        }

        if (snapshot.getPh() < threshold.getMinPH() || snapshot.getPh() > threshold.getMaxPH()) {
            exceedsThreshold = true;
        }

        if (snapshot.getTds() < threshold.getMinTds() || snapshot.getTds() > threshold.getMaxTds()) {
            aquarium.setBombWorking(true);
            exceedsThreshold = true;
            aquariums.save(aquarium);
        }

        if (snapshot.getHeight() < threshold.getMinHeight() || snapshot.getHeight() > threshold.getMaxHeight()) {
            exceedsThreshold = true;
        }

        return new SnapshotResponse(aquarium.isBombWorking(), exceedsThreshold);
    }

    @Async
    public Future<Page<SensorsSnapshot>> getSnapshots(String aquariumId, int page, int size) {
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
    public Optional<AquariumResponse> createAquarium(Aquarium aquarium) {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var threshold = new Threshold();
        aquarium.setOwner(principal);
        aquarium.setThreshold(threshold);
        threshold.setAquarium(aquarium);

        thresholds.save(threshold);
        aquariums.save(aquarium);
        return Optional.of(objectMapper.convertValue(aquarium, AquariumResponse.class));
    }

    public Optional<PrivAquariumResponse> getAquarium(String id) {
        var res = aquariums.findById(UUID.fromString(id));
        checkPermission(res);
        var aquarium = res.get();
        PrivAquariumResponse aquariumResponse = objectMapper.convertValue(aquarium, PrivAquariumResponse.class);
        ThresholdResponse thresholdResponse = objectMapper.convertValue(res.get().getThreshold(), ThresholdResponse.class);

        aquariumResponse.setOwnerUsername(aquarium.getOwner().getNickname());
        aquariumResponse.setThreshold(thresholdResponse);
        return Optional.of(aquariumResponse);
    }

    @Transactional
    public Optional<AquariumResponse> updateAquarium(EditAquariumForm form) {
        var res = aquariums.findById(UUID.fromString(form.getId()));
        var aquarium = checkPermission(res);

        aquarium.setName(form.getName());
        aquarium.setLocation(form.getLocation());
        aquariums.save(aquarium);
        return Optional.of(objectMapper.convertValue(aquarium, AquariumResponse.class));
    }

    @Transactional
    public Optional<Void> deleteAquarium(String aquariumId) {
        var res = aquariums.findById(UUID.fromString(aquariumId));
        var aquarium = checkPermission(res);

        var u = aquarium.getOwner();
        snapshots.deleteAllByAquariumIn(u.getOwns());
        groups.deleteAllByOwner(u);
        thresholds.deleteAllByAquariumIn(u.getOwns());
        aquariums.deleteAllByOwner(u);

        return Optional.empty();
    }

    @Async
    public Future<List<PrivAquariumResponse>> listAquariums() {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        var ownedAq = principal.getOwns();

        var managedAq = principal.getManages();

        return CompletableFuture.completedFuture(Stream.concat(ownedAq.stream(), managedAq.stream()).distinct()
                .map(aquarium -> objectMapper.convertValue(aquarium, PrivAquariumResponse.class)).toList());
    }

    @Transactional
    public GroupsResponse createGroup(String groupName) {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var group = new Group(groupName, false, new HashSet<>(), principal);
        principal.getGroups().add(group);
        groups.save(group);
        users.save(principal);
        return objectMapper.convertValue(group, GroupsResponse.class);
    }

    public List<GroupsResponse> listGroups() {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var groups = principal.getGroups();
        List<GroupsResponse> response = new ArrayList<>();
        for (Group group : groups) {
            List<String> aquariums = group.getAquariums().stream().map(Aquarium::getName).toList();
            response.add(new GroupsResponse(group.getId().toString(), group.getName(), aquariums));
        }
        return response;
    }

    @Async
    public Future<Page<PrivAquariumResponse>> searchAquariums(String query, int page, int size) {
        var pageable = PageRequest.of(page, size);
        Page<Aquarium> aquariums = this.aquariums.search(query, pageable);
        return CompletableFuture.completedFuture(aquariums.map(aquarium -> objectMapper.convertValue(aquarium, PrivAquariumResponse.class)));
    }

    @Transactional
    public boolean bombAquarium(String aquariumId) {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var aquariumRes = aquariums.findById(UUID.fromString(aquariumId));
        if (aquariumRes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        var aquarium = aquariumRes.get();

        if (!aquarium.getOwner().getId().equals(principal.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        var state = aquarium.isBombWorking();
        aquarium.setBombWorking(!state);
        aquariums.save(aquarium);
        return !state;
    }

    @Transactional
    public Optional<AquariumResponse> addAquariumToGroup(String groupId, String aquariumId) {
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

        if (!principal.getGroups().contains(group)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        group.getAquariums().add(aquarium);
        aquarium.getGroups().add(group);
        groups.save(group);
        aquariums.save(aquarium);

        return Optional.of(objectMapper.convertValue(aquarium, AquariumResponse.class));
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

        if (!principal.getGroups().contains(group)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        group.getAquariums().remove(aquarium);
        aquarium.getGroups().remove(group);
        groups.save(group);
        aquariums.save(aquarium);

        return Optional.empty();
    }

    public List<AquariumResponse> getAquariumsInGroup(String groupId) {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var groupRes = groups.findById(UUID.fromString(groupId));
        if (groupRes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        var group = groupRes.get();

        if (!principal.getGroups().contains(group)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        return group.getAquariums().stream()
                .map(aquarium -> objectMapper.convertValue(aquarium, AquariumResponse.class)).toList();
    }

    @Transactional
    public ThresholdResponse editThreshold(ThresholdForm form) {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var aquarium = aquariums.findById(UUID.fromString(form.getAquariumId()));

        if (aquarium.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        if (!aquarium.get().getOwner().getId().equals(principal.getId())) {
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

        thresholds.save(threshold);
        return objectMapper.convertValue(threshold, ThresholdResponse.class);
    }

    private Aquarium checkPermission(Optional<Aquarium> res) {
        if (res.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        var aquarium = res.get();
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!aquarium.getOwner().getId().equals(principal.getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        return aquarium;
    }
}
