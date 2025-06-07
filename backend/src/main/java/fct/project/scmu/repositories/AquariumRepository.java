package fct.project.scmu.repositories;

import fct.project.scmu.daos.Aquarium;
import fct.project.scmu.daos.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AquariumRepository extends JpaRepository<Aquarium, UUID> {
    Optional<Aquarium> findByName(String name);

    boolean existsByName(String name);

    boolean existsByIdAndOwner(UUID aquariumId, User owner);

    void deleteAllByOwner(User owner);

    @Query("SELECT COUNT(a) > 0 FROM aquariums a LEFT JOIN a.managers m " +
            "WHERE a = :aquarium AND (m = :user OR a.owner = :user)")
    boolean isUserManagerOrOwner(@Param("aquarium") Aquarium aquarium, @Param("user") User user);


    @Query("SELECT a FROM aquariums a WHERE a.name LIKE %:query% " +
            "OR a.location LIKE %:query% OR a.owner.nickname LIKE %:query% ")
    Page<Aquarium> search(String query, Pageable pageable);

    @Query("SELECT a FROM aquariums a WHERE a.owner = :user OR :user MEMBER OF a.managers")
    List<Aquarium> list(User user);

    boolean existsByEspId(String espId);
}
