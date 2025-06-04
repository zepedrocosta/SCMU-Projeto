package fct.project.scmu.repositories;

import fct.project.scmu.daos.Aquarium;
import fct.project.scmu.daos.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface AquariumRepository extends JpaRepository<Aquarium, UUID> {
    Optional<Aquarium> findByName(String name);

    void deleteAllByOwner(User owner);

    @Query("SELECT a FROM aquariums a WHERE a.name LIKE %:query% " +
            "OR a.location LIKE %:query% OR a.owner.nickname LIKE %:query% ")
    Page<Aquarium> search(String query, Pageable pageable);
}
