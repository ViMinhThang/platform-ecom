# Stage 1: Build
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy shared-commons and install it to local repo
COPY shared-commons/ ./shared-commons/
RUN mvn clean install -DskipTests -f shared-commons/pom.xml

# Copy analytics module
COPY analytics/ ./analytics/

# Build analytics service
RUN mvn clean package -DskipTests -f analytics/pom.xml

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/analytics/target/*.jar app.jar

EXPOSE 8089
ENTRYPOINT ["java", "-jar", "app.jar"]
