package fct.project.scmu.controllers;


import fct.project.scmu.daos.Aquarium;
import fct.project.scmu.daos.SensorsSnapshot;
import fct.project.scmu.dtos.forms.aquariums.AquariumForm;
import fct.project.scmu.dtos.forms.aquariums.EditAquariumForm;
import fct.project.scmu.dtos.forms.aquariums.SensorSnapshotForm;
import fct.project.scmu.dtos.forms.aquariums.ThresholdForm;
import fct.project.scmu.dtos.responses.aquariums.*;
import fct.project.scmu.services.AquariumService;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rest/aquariums")
public class AquariumController extends AbstractController{

    private final AquariumService aquariumService;

    @PostMapping("/snapshot")
    public ResponseEntity<SnapshotResponse> storeSnapshot(@RequestBody SensorSnapshotForm form) {
        return ok(aquariumService.storeSnapshot(convert(form, SensorsSnapshot.class), form.getAquariumId()));
    }

    @SneakyThrows
    @GetMapping("/snapshot")
    public ResponseEntity<Page<SensorsSnapshot>> getSnapshots(@RequestParam String aquariumId,
                                                              @RequestParam(required = false) LocalDateTime date,
                                                              @RequestParam(defaultValue = "0") Integer page,
                                                              @RequestParam(defaultValue = "288") Integer size) {
        return ok(aquariumService.getSnapshots(aquariumId, page, size).get());
    }

    @PostMapping
    public ResponseEntity<AquariumResponse> createAquarium(@RequestBody AquariumForm form) {
        return ok(aquariumService.createAquarium(convert(form, Aquarium.class)));
    }

    @GetMapping
    public ResponseEntity<PrivAquariumResponse> getAquarium(@RequestParam String id) {
        return ok(aquariumService.getAquarium(id));
    }

    @PutMapping
    public ResponseEntity<AquariumResponse> updateAquarium(@RequestBody EditAquariumForm form) {
        return ok(aquariumService.updateAquarium(form));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAquarium(@RequestParam String id) {
        return ok(aquariumService.deleteAquarium(id));
    }

    @SneakyThrows
    @GetMapping("/list")
    public ResponseEntity<List<AquariumResponse>> listAquariums() {
        return ok(aquariumService.listAquariums().get());
    }

    @SneakyThrows
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Page<AquariumResponse>> searchAquariums(@RequestParam String query,
                                                                  @RequestParam(defaultValue = "0") Integer page,
                                                                 @RequestParam(defaultValue = "12") Integer size) {
        return ok(aquariumService.searchAquariums(query, page, size).get());
    }

    @PutMapping("/bomb")
    public ResponseEntity<Boolean> bombAquarium(@RequestParam String aquariumId) {
        return ok(aquariumService.bombAquarium(aquariumId));
    }

    @PostMapping("/groups")
    public ResponseEntity<String> createGroup(@RequestParam String groupName) {
        return ok(aquariumService.createGroup(groupName));
    }

    @GetMapping("/groups") //TODO: Check if aquariums are needed here
    public ResponseEntity<List<GroupsResponse>> listGroups() {
        return ok(aquariumService.listGroups());
    }

    @PostMapping("/groups/aquariums")
    public ResponseEntity<AquariumResponse> addAquariumToGroup(@RequestParam String groupId,
                                                   @RequestParam String aquariumId) {
        return ok(aquariumService.addAquariumToGroup(groupId, aquariumId));
    }

    @DeleteMapping("/groups/aquariums")
    public ResponseEntity<Void> removeAquariumFromGroup(@RequestParam String groupId,
                                                        @RequestParam String aquariumId) {
        return ok(aquariumService.removeAquariumFromGroup(groupId, aquariumId));
    }

    @GetMapping("/groups/aquariums")
    public ResponseEntity<List<AquariumResponse>> getAquariumsInGroup(@RequestParam String groupId) {
        return ok(aquariumService.getAquariumsInGroup(groupId));
    }

    @PutMapping("/threshold")
    public ResponseEntity<ThresholdResponse> editThreshold(@RequestBody ThresholdForm form) {
        return ok(aquariumService.editThreshold(form));
    }

}
