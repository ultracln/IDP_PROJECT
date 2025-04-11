FROM openjdk:17-jdk-slim

# Copy the jar file built by Maven
COPY target/*.jar app.jar

# Run the application
ENTRYPOINT ["java", "-jar", "/app.jar"]
