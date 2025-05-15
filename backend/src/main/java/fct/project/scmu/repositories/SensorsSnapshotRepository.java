package fct.project.scmu.repositories;

import fct.project.scmu.daos.SensorsSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SensorsSnapshotRepository extends JpaRepository<SensorsSnapshot, UUID> {
}
