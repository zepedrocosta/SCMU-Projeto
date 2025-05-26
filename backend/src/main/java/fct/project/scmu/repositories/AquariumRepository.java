package fct.project.scmu.repositories;

import fct.project.scmu.daos.Aquarium;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AquariumRepository extends JpaRepository<Aquarium, UUID> {
    Optional<Aquarium> findByName(String name);
}
