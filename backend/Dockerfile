FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/scmu-0.1.jar scmu-0.1.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "scmu-0.1.jar"]
