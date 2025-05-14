package fct.project.scmu.repositories;

import fct.project.scmu.daos.Session;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SessionRepository extends JpaRepository<Session, UUID> {
    //boolean existsByUserAndEndedIsNull(String user);
    //Optional<Session> findByUserAndEndedIsNull(String user);
}
