FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy parent POM and common module
COPY ../pom.xml ./pom.xml
COPY ../vision-common ./vision-common

# Copy service
COPY ./${service} ./${service}

# Build
WORKDIR /app/${service}
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /app/${service}/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
