package fct.project.scmu.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Beans {

    @Bean
    ModelMapper mapper() {
        // Automatically handles object mapping, e.g. from DTO to DAO and vice versa.
        return new ModelMapper();
    }
}
