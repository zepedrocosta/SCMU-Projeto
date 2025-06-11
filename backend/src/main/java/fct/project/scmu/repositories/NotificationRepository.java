package fct.project.scmu.repositories;

import fct.project.scmu.daos.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    @Query("SELECT n FROM notifications n " +
            "JOIN n.users u " +
            "WHERE u.id = :userId " +
            "AND n.createdDate >= :startDate")
    List<Notification> fetch(@Param("userId") UUID userId,
                             @Param("startDate") LocalDateTime startDate);

}
