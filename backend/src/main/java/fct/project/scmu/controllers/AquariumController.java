package fct.project.scmu.controllers;

import fct.project.scmu.daos.SensorsSnapshot;
import fct.project.scmu.dtos.forms.aquariums.SensorSnapshotForm;
import fct.project.scmu.services.AquariumService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rest/aquariums")
public class AquariumController extends AbstractController{

    private final AquariumService aquariumService;

    @PostMapping("/snapshot")
    public ResponseEntity<Void> storeSnapshot(@RequestBody SensorSnapshotForm form) {
        return ok(aquariumService.storeSnapshot(convert(form, SensorsSnapshot.class)));
    }

}
