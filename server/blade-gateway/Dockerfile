FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build

# Copy parent POM
COPY pom.xml .
COPY vision-common vision-common
COPY blade-gateway blade-gateway

# Build
RUN cd vision-common && mvn clean install -DskipTests
RUN cd blade-gateway && mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /build/blade-gateway/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
