package fct.project.scmu.daos;

import jakarta.persistence.Entity;
import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true, callSuper = true)
@EqualsAndHashCode(doNotUseGetters = true, callSuper = true)
@Entity(name = "aquariums")
public class Aquarium extends DAO implements Serializable {

    private String name;

    private String location;

    private double latitude;

    private double longitude;

    private double temperature;

    private double light;

    private double ph;

    private double solids;

    private double height;


}
