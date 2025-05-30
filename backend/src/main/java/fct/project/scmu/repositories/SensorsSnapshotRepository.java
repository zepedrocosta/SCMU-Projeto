package fct.project.scmu.repositories;

import fct.project.scmu.daos.Aquarium;
import fct.project.scmu.daos.SensorsSnapshot;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SensorsSnapshotRepository extends JpaRepository<SensorsSnapshot, UUID> {

    Page<SensorsSnapshot> findAllByAquariumOrderByCreatedDateDesc(Aquarium aquarium, Pageable pageable);
}
