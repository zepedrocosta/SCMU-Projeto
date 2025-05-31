package fct.project.scmu.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import fct.project.scmu.daos.Aquarium;
import fct.project.scmu.daos.Group;
import fct.project.scmu.daos.SensorsSnapshot;
import fct.project.scmu.daos.User;
import fct.project.scmu.dtos.forms.aquariums.EditAquariumForm;
import fct.project.scmu.dtos.forms.aquariums.ThresholdForm;
import fct.project.scmu.dtos.responses.aquariums.AquariumResponse;
import fct.project.scmu.dtos.responses.aquariums.ThresholdResponse;
import fct.project.scmu.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
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

    public Optional<Void> storeSnapshot(SensorsSnapshot snapshot, String aquariumId) {
        var aquarium = aquariumRepository.findByName(aquariumId);
        if (aquarium.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        snapshot.setAquarium(aquarium.get());
        snapshotRepository.save(snapshot);
        return Optional.empty();
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

    public Optional<Aquarium> getAquarium(String id) {
        var res = aquariumRepository.findById(UUID.fromString(id));
        checkPermission(res);

        return res;
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
        var res = aquariumRepository.findByName(aquariumId);
        var aquarium = checkPermission(res);

        aquariumRepository.delete(aquarium);
        return Optional.empty();
    }

    public List<AquariumResponse> listAquariums() {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        var ownedAq = principal.getOwns();

        var managedAq = principal.getManages();

        return Stream.concat(ownedAq.stream(), managedAq.stream()).distinct()
                .map(aquarium -> objectMapper.convertValue(aquarium, AquariumResponse.class)).toList();
    }

    public String createGroup(String groupName) {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var group = new Group(groupName, new HashSet<>(), principal);
        principal.getGroups().add(group);
        groupsRepository.save(group);
        userRepository.save(principal);
        return groupName;
    }

    public List<String> listGroups() {
        var principal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return principal.getGroups().stream().map(Group::getName).toList();
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
