package fct.project.scmu.repositories;

import fct.project.scmu.daos.Notification;
import fct.project.scmu.daos.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findAllByUsersContaining(User user);

    @Modifying
    @Query("UPDATE notifications n SET n.isRead = true WHERE :user MEMBER OF n.users AND n.isRead = false")
    void markAllAsReadByUser(@Param("user") User user);
}
