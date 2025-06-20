package fct.project.scmu.repositories;

import fct.project.scmu.daos.Role;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Optional;
import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role, UUID> {
    boolean existsByRole(String role);

    Role findByRole(String role);
}
