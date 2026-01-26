# Stage 1: Runtime
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# Copy the pre-built jar from the host
COPY analytics/target/*.jar app.jar

EXPOSE 8089
ENTRYPOINT ["java", "-jar", "app.jar"]
