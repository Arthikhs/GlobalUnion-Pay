FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY pom.xml ./pom.xml
COPY backend/notification-service/pom.xml ./backend/notification-service/pom.xml
COPY backend/notification-service/src ./backend/notification-service/src
RUN apk add --no-cache maven && mvn -f backend/notification-service/pom.xml clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/backend/notification-service/target/*.jar app.jar
EXPOSE 8087
ENTRYPOINT ["java", "-jar", "app.jar"]
