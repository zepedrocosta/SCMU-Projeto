package fct.project.scmu.repositories;

import fct.project.scmu.daos.Aquarium;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AquariumRepository extends JpaRepository<Aquarium, UUID> {
    Aquarium findByName(String name);
}
