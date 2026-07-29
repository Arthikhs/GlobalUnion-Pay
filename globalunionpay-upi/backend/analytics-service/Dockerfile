FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY pom.xml ./pom.xml
COPY backend/analytics-service/pom.xml ./backend/analytics-service/pom.xml
COPY backend/analytics-service/src ./backend/analytics-service/src
RUN apk add --no-cache maven && mvn -f backend/analytics-service/pom.xml clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/backend/analytics-service/target/*.jar app.jar
EXPOSE 8089
ENTRYPOINT ["java", "-jar", "app.jar"]
