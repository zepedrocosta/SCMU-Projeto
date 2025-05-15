package fct.project.scmu;

import fct.project.scmu.daos.Aquarium;
import fct.project.scmu.repositories.AquariumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.HashSet;

@SpringBootApplication
public class ScmuApplication implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(ScmuApplication.class, args);
    }

    @Autowired
    private AquariumRepository aq;

    @Override
    public void run(String... args) throws Exception {
        aq.save(new Aquarium("Aquarium 1", "FCT", 0, 0, new HashSet<>()));
    }
}
