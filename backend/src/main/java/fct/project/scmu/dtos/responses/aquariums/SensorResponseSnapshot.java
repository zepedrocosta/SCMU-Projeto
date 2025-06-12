package fct.project.scmu.dtos.responses.aquariums;

public record SensorResponseSnapshot(
    String id,
    double temperature,
    boolean ldr,
    double ph,
    int tds,
    double height,
    boolean areValuesNormal,
    String createdDate,
    String aquariumId,
    String minTemperature,
    String maxTemperature,
    String minPh,
    String maxPh,
    String minTds,
    String maxTds,
    String minHeight,
    String maxHeight,
    boolean isBombWorking
) {

}
