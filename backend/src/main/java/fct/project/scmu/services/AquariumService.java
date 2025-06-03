package fct.project.scmu.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import fct.project.scmu.daos.Aquarium;
import fct.project.scmu.daos.Group;
import fct.project.scmu.daos.SensorsSnapshot;
import fct.project.scmu.daos.User;
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

    private final AquariumRepository aquariumRepository;
    private final SensorsSnapshotRepository snapshotRepository;
    private final UserRepository userRepository;
    private final GroupsRepository groupsRepository;
    private final ThresholdRepository thresholdRepository;
    private final ObjectMapper objectMapper;

    public SnapshotResponse storeSnapshot(SensorsSnapshot snapshot, String aquariumId) {
        var response = aquariumRepository.findByName(aquariumId);
        if (response.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        var aquarium = response.get();
        snapshot.setAquarium(aquarium);
        snapshotRepository.save(snapshot);

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
            aquariumRepository.save(aquarium);
        }

        if (snapshot.getHeight() < threshold.getMinHeight() || snapshot.getHeight() > threshold.getMaxHeight()) {
            exceedsThreshold = true;
        }

        return new SnapshotResponse(aquarium.isBombWorking(), exceedsThreshold);
    }

    @Async
    public Future<Page<SensorsSnapshot>> getSnapshots(String aquariumId, int page, int size) {
        var pageable = PageRequest.of(page, size);
        var res = aquariumRepository.findByName(aquariumId);
        if (res.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        var aquarium = res.get();
        return CompletableFuture.completedFuture(
                snapshotRepository.findAllByAquariumOrderByCreatedDateDesc(aquarium, pageable));

    }

    public Optional<AquariumResponse> createAquarium(Aquarium aquarium) {
        aquariumRepository.save(aquarium);
        return Optional.of(objectMapper.convertValue(aquarium, AquariumResponse.class));
    }

    public Optional<PrivAquariumResponse> getAquarium(String id) {
        var res = aquariumRepository.findById(UUID.fromString(id));
        checkPermission(res);
        var aquarium = res.get();
        PrivAquariumResponse aquariumResponse = objectMapper.convertValue(aquarium, PrivAquariumResponse.class);
        ThresholdResponse thresholdResponse = objectMapper.convertValue(res.get().getThreshold(), ThresholdResponse.class);

        aquariumResponse.setOwnerUsername(aquarium.getOwner().getNickname());
        aquariumResponse.setThreshold(thresholdResponse);
        return Optional.of(aquariumResponse);
    }

    public Optional<AquariumResponse> updateAquarium(EditAquariumForm form) {
        var res = aquariumRepository.findById(UUID.fromString(form.getId()));
        var aquarium = checkPermission(res);

        aquarium.setName(form.getName());
        aquarium.setLocation(form.getLocation());
        aquariumRepository.save(aquarium);
        return Optional.of(objectMapper.convertValue(aquarium, AquariumResponse.class));
    }


    public Optional<Void> deleteAquarium(String aquariumId) {
        var res = aquariumRepository.findById(UUID.fromString(aquariumId));
        var aquarium = checkPermission(res);

        aquariumRepository.delete(aquarium);

        return Optional.empty();
    }

    @Async
    public Future<List<AquariumResponse>> listAquariums() {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        var ownedAq = principal.getOwns();

        var managedAq = principal.getManages();

        return CompletableFuture.completedFuture(Stream.concat(ownedAq.stream(), managedAq.stream()).distinct()
                .map(aquarium -> objectMapper.convertValue(aquarium, AquariumResponse.class)).toList());
    }

    public String createGroup(String groupName) {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var group = new Group(groupName, new HashSet<>(), principal);
        principal.getGroups().add(group);
        groupsRepository.save(group);
        userRepository.save(principal);
        return groupName;
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
    public Future<Page<AquariumResponse>> searchAquariums(String query, int page, int size) {
        var pageable = PageRequest.of(page, size);
        Page<Aquarium> aquariums = aquariumRepository.search(query, pageable);
        return CompletableFuture.completedFuture(aquariums.map(aquarium -> objectMapper.convertValue(aquarium, AquariumResponse.class)));
    }

    public boolean bombAquarium(String aquariumId) {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var aquariumRes = aquariumRepository.findByName(aquariumId);
        if (aquariumRes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        var aquarium = aquariumRes.get();

        if (!aquarium.getOwner().getId().equals(principal.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        var state = aquarium.isBombWorking();
        aquarium.setBombWorking(!state);
        aquariumRepository.save(aquarium);
        return !state;
    }

    public Optional<AquariumResponse> addAquariumToGroup(String groupId, String aquariumId) {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var groupRes = groupsRepository.findById(UUID.fromString(groupId));
        if (groupRes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        var group = groupRes.get();

        var aquariumRes = aquariumRepository.findByName(aquariumId);
        if (aquariumRes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        var aquarium = aquariumRes.get();

        if (!principal.getGroups().contains(group)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        group.getAquariums().add(aquarium);
        aquarium.getGroups().add(group);
        groupsRepository.save(group);
        aquariumRepository.save(aquarium);

        return Optional.of(objectMapper.convertValue(aquarium, AquariumResponse.class));
    }

    public Optional<Void> removeAquariumFromGroup(String groupId, String aquariumId) {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var groupRes = groupsRepository.findById(UUID.fromString(groupId));
        if (groupRes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        var group = groupRes.get();

        var aquariumRes = aquariumRepository.findByName(aquariumId);
        if (aquariumRes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        var aquarium = aquariumRes.get();

        if (!principal.getGroups().contains(group)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        group.getAquariums().remove(aquarium);
        aquarium.getGroups().remove(group);
        groupsRepository.save(group);
        aquariumRepository.save(aquarium);

        return Optional.empty();
    }

    public List<AquariumResponse> getAquariumsInGroup(String groupId) {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var groupRes = groupsRepository.findById(UUID.fromString(groupId));
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

    public ThresholdResponse editThreshold(ThresholdForm form) {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var aquarium = aquariumRepository.findById(UUID.fromString(form.getAquariumId()));

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

        thresholdRepository.save(threshold);
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
