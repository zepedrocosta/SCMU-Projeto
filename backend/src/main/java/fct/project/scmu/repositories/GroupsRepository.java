package fct.project.scmu.repositories;

import fct.project.scmu.daos.Group;
import fct.project.scmu.daos.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface GroupsRepository extends JpaRepository<Group, UUID> {
    void deleteAllByOwner(User owner);
}
