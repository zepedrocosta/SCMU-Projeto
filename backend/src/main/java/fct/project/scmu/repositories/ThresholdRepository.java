package fct.project.scmu.repositories;

import fct.project.scmu.daos.Aquarium;
import fct.project.scmu.daos.Threshold;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;
import java.util.UUID;

public interface ThresholdRepository extends JpaRepository<Threshold, UUID> {
    void deleteAllByAquariumIn(Set<Aquarium> aquariums);
}
