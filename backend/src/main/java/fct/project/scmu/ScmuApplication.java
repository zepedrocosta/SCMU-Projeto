package fct.project.scmu;

import fct.project.scmu.daos.Role;
import fct.project.scmu.daos.User;
import fct.project.scmu.daos.enums.UserStatus;
import fct.project.scmu.repositories.RoleRepository;
import fct.project.scmu.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
public class ScmuApplication implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(ScmuApplication.class, args);
    }

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${scmu.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        if (!roleRepository.existsByRole("ADMIN")) {
            Role role = new Role("ADMIN", "Role used by App's administrators and devs", new HashSet<>());
            roleRepository.save(role);
            userRepository.save(new User("admin", passwordEncoder.encode(adminPassword), "Admin",
                    "admin@aqsmart.pt", UserStatus.ACTIVE, Set.of(role), new HashSet<>(), new HashSet<>(),
                    new HashSet<>(), new HashSet<>()));
        }

        if (!roleRepository.existsByRole("USER")) {
            roleRepository.save(new Role("USER", "Role used by App's users", new HashSet<>()));
        }
    }
}
