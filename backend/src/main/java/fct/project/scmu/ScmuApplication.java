package fct.project.scmu;

import fct.project.scmu.daos.Aquarium;
import fct.project.scmu.daos.Role;
import fct.project.scmu.daos.Threshold;
import fct.project.scmu.daos.User;
import fct.project.scmu.daos.enums.UserStatus;
import fct.project.scmu.repositories.AquariumRepository;
import fct.project.scmu.repositories.RoleRepository;
import fct.project.scmu.repositories.ThresholdRepository;
import fct.project.scmu.repositories.UserRepository;
import org.checkerframework.checker.units.qual.A;
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

    @Autowired
    private ThresholdRepository thresholdRepository;

    public static void main(String[] args) {
        SpringApplication.run(ScmuApplication.class, args);
    }

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AquariumRepository aquariumRepository;

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
                    new HashSet<>(), new HashSet<>(), new HashSet<>()));
        }

        if (!roleRepository.existsByRole("USER")) {
            Role role = new Role("USER", "Role used by App's users", new HashSet<>());
            roleRepository.save(role);
            userRepository.save(new User("user", passwordEncoder.encode(adminPassword), "User",
                    "user@aqsmart.pt", UserStatus.ACTIVE, Set.of(role), new HashSet<>(), new HashSet<>(),
                    new HashSet<>(), new HashSet<>(), new HashSet<>()));
        }

        var user = userRepository.findByNickname("admin").get();
        if (!aquariumRepository.existsByName("Aq1")) {
            var threshold = new Threshold();
            var aquarium = new Aquarium();
            aquarium.setName("Aq1");
            aquarium.setLocation("Covilha");
            aquarium.setOwner(user);
            aquarium.setThreshold(threshold);
            aquarium.setEsp("esp1");
            threshold.setAquarium(aquarium);
            thresholdRepository.save(threshold);
            aquariumRepository.save(aquarium);
        }

        user = userRepository.findByNickname("user").get();
        if (aquariumRepository.existsByName("Aq2")) {
            var threshold = new Threshold();
            var aquarium = new Aquarium();
            aquarium.setName("Aq2");
            aquarium.setLocation("Caparica");
            aquarium.setOwner(user);
            aquarium.setThreshold(threshold);
            aquarium.setEsp("esp2");
            threshold.setAquarium(aquarium);
            thresholdRepository.save(threshold);
            aquariumRepository.save(aquarium);
        }
    }
}
