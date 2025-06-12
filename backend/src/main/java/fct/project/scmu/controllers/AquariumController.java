package fct.project.scmu.controllers;


import fct.project.scmu.daos.Aquarium;
import fct.project.scmu.daos.Notification;
import fct.project.scmu.daos.SensorsSnapshot;
import fct.project.scmu.dtos.forms.aquariums.*;
import fct.project.scmu.dtos.responses.aquariums.*;
import fct.project.scmu.services.AquariumService;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/rest/aquariums")
public class AquariumController extends AbstractController{

    private final AquariumService aquariumService;

    @PostMapping("/snapshot")
    public ResponseEntity<SetSnapshotResponse> storeSnapshot(@RequestBody SensorSnapshotForm form) {
        return ok(aquariumService.storeSnapshot(convert(form, SensorsSnapshot.class), form.getEsp()));
    }

    @GetMapping("/snapshot/{aquariumId}")
    public ResponseEntity<GetLastSnapshotResponse> getLastSnapshot(@PathVariable String aquariumId) {
        return ok(aquariumService.getLastSnapshot(aquariumId), GetLastSnapshotResponse.class);
    }

    @SneakyThrows
    @GetMapping("/snapshot/{aquariumId}/history")
    public ResponseEntity<Page<SensorResponseSnapshot>> getSnapshots(
        @PathVariable String aquariumId,
        @RequestParam(required = false) LocalDateTime date,
        @RequestParam(defaultValue = "0") Integer page,
        @RequestParam(defaultValue = "288") Integer size
    ) {
        var snapshots = aquariumService.getSnapshots(aquariumId, date, page, size).get();
        var dtoPage = snapshots.map(AquariumController::toDto);
        return ResponseEntity.ok(dtoPage);
    }

    @PostMapping
    public ResponseEntity<AquariumResponse> createAquarium(@RequestBody AquariumForm form) {
        return ok(aquariumService.createAquarium(convert(form, Aquarium.class)), AquariumResponse.class);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PrivAquariumResponse> getAquarium(@PathVariable String id) {
        return ok(aquariumService.getAquarium(id), PrivAquariumResponse.class);
    }

    @PutMapping
    public ResponseEntity<AquariumResponse> updateAquarium(@RequestBody EditAquariumForm form) {
        return ok(aquariumService.updateAquarium(form), AquariumResponse.class);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAquarium(@PathVariable String id) {
        return ok(aquariumService.deleteAquarium(id));
    }

    @SneakyThrows
    @GetMapping("/list")
    public ResponseEntity<List<PrivAquariumResponse>> listAquariums() {
        var token = new TypeToken<List<PrivAquariumResponse>>(){}.getType();
        return ok(aquariumService.listAquariums().get(), token);
    }

    @SneakyThrows
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Page<PrivAquariumResponse>> searchAquariums(@RequestParam String query,
                                                                  @RequestParam(defaultValue = "0") Integer page,
                                                                 @RequestParam(defaultValue = "12") Integer size) {
        var token = new TypeToken<Page<PrivAquariumResponse>>(){}.getType();
        return ok(aquariumService.searchAquariums(query, page, size).get(), token);
    }

    @PutMapping("/bomb")
    public ResponseEntity<Boolean> bombAquarium(@RequestParam String aquariumId) {
        return ok(aquariumService.bombAquarium(aquariumId));
    }

    @PostMapping("/groups")
    public ResponseEntity<GroupsResponse> createGroup(@RequestParam String groupName) {
        return ok(aquariumService.createGroup(groupName), GroupsResponse.class);
    }

    @DeleteMapping("/groups/{groupId}")
    public ResponseEntity<Void> deleteGroup(@PathVariable String groupId) {
        return ok(aquariumService.deleteGroup(groupId));
    }

    @GetMapping("/groups")
    public ResponseEntity<List<GroupsResponse>> listGroups() {
        var token = new TypeToken<List<GroupsResponse>>(){}.getType();
        return ok(aquariumService.listGroups(), token);
    }

    @PostMapping("/groups/values")
    public ResponseEntity<AquariumResponse> addAquariumToGroup(@RequestBody AquariumToGroupForm form) {
        return ok(aquariumService.addAquariumToGroup(form.getGroupId(), form.getAquariumId()), AquariumResponse.class);
    }

    @DeleteMapping("/groups/values")
    public ResponseEntity<Void> removeAquariumFromGroup(@RequestBody AquariumToGroupForm form) {
        return ok(aquariumService.removeAquariumFromGroup(form.getGroupId(), form.getAquariumId()));
    }

    @GetMapping("/groups/{groupId}")
    public ResponseEntity<List<AquariumResponse>> getAquariumsInGroup(@PathVariable String groupId) {
        var token = new TypeToken<List<AquariumResponse>>(){}.getType();
        return ok(aquariumService.getAquariumsInGroup(groupId), token);
    }

    @PostMapping("/manage")
    public ResponseEntity<List<String>> addManager(@RequestBody ManagerForm form) {
        return ok(aquariumService.addManager(form));
    }

    @DeleteMapping("/manage")
    public ResponseEntity<List<String>> removeManager(@RequestBody ManagerForm form) {
        return ok(aquariumService.removeManager(form));
    }

    @PutMapping("/threshold")
    public ResponseEntity<ThresholdResponse> editThreshold(@RequestBody ThresholdForm form) {
        return ok(aquariumService.editThreshold(form), ThresholdResponse.class);
    }

    @SneakyThrows
    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationResponse>> fetchNotifications(@RequestParam(defaultValue = "N/A") String startDate) {
        LocalDateTime date;
        if (startDate.equals("N/A"))
            date = LocalDateTime.now().minusDays(1);
        else
            date = LocalDateTime.parse(startDate);

        var bla = aquariumService.fetchNotifications(date).get();

        var notifications = toNotificationResponse(bla);

        return ResponseEntity.ok(notifications);
    }

    private static List<NotificationResponse> toNotificationResponse(List<Notification> notification) {
        return notification.stream()
                .map(n -> new NotificationResponse(
                        n.getId().toString(),
                        n.getMessage(),
                        n.getCreatedDate(),
                        n.getSnapshotId(),
                        n.getAquariumId()
                )).toList();
    }

    private static SensorResponseSnapshot toDto(SensorsSnapshot entity) {
        var threshold = entity.getThreshold();
        return new SensorResponseSnapshot(
                entity.getId() != null ? entity.getId().toString() : null,
                entity.getTemperature(),
                entity.isLdr(),
                entity.getPh(),
                entity.getTds(),
                entity.getHeight(),
                entity.isAreValuesNormal(),
                entity.getCreatedDate() != null ? entity.getCreatedDate().toString() : null,
                entity.getAquarium() != null ? entity.getAquarium().getId().toString() : null,
                threshold != null ? String.valueOf(threshold.getMinTemperature()) : null,
                threshold != null ? String.valueOf(threshold.getMaxTemperature()) : null,
                threshold != null ? String.valueOf(threshold.getMinPH()) : null,
                threshold != null ? String.valueOf(threshold.getMaxPH()) : null,
                threshold != null ? String.valueOf(threshold.getMinTds()) : null,
                threshold != null ? String.valueOf(threshold.getMaxTds()) : null,
                threshold != null ? String.valueOf(threshold.getMinHeight()) : null,
                threshold != null ? String.valueOf(threshold.getMaxHeight()) : null,
                entity.isBombWorking()
        );
    }

}
