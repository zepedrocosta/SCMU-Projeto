package fct.project.scmu.services;

import fct.project.scmu.daos.SensorsSnapshot;
import fct.project.scmu.repositories.AquariumRepository;
import fct.project.scmu.repositories.SensorsSnapshotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AquariumService {

    private final AquariumRepository aquariumRepository;
    private final SensorsSnapshotRepository snapshotRepository;

    public Optional<Void> storeSnapshot(SensorsSnapshot snapshot) {
        var aquarium = aquariumRepository.findByName("Aquarium 1");
        snapshot.setAquarium(aquarium);

        snapshotRepository.save(snapshot);
        return Optional.empty();
    }
}
