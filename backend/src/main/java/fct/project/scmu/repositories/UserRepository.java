package fct.project.scmu.repositories;

import fct.project.scmu.daos.User;
import fct.project.scmu.daos.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    boolean existsByEmail(String email);

    boolean existsByNickname(String nickname);

    Optional<User> findByVerifyHash(String verifyHash);

    Optional<User> findByEmail(String email);

    Optional<User> findByNickname(String nickname);

    Optional<User> findByNicknameAndStatus(String nickname, UserStatus status);

    Optional<User> findByEmailAndStatus(String email, UserStatus status);

    Page<User> findByNicknameLike(String nickname, Pageable pageable);

    Page<User> findAll(Pageable pageable);
}
