package fct.project.scmu.repositories;

import fct.project.scmu.daos.Group;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface GroupsRepository extends JpaRepository<Group, UUID> {
}
