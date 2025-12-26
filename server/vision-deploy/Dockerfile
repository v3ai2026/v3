FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build

COPY pom.xml .
COPY vision-common vision-common
COPY vision-deploy vision-deploy

RUN cd vision-common && mvn clean install -DskipTests
RUN cd vision-deploy && mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /build/vision-deploy/target/*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]
