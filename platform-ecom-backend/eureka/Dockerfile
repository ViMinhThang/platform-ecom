# L09: builds the module + its reactor deps (parent pom, shared-commons).
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build
COPY pom.xml ./
COPY shared-commons ./shared-commons
COPY eureka ./eureka
RUN mvn -q -pl eureka -am package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /build/eureka/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
