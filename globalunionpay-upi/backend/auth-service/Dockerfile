FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY pom.xml ./pom.xml
COPY backend/auth-service/pom.xml ./backend/auth-service/pom.xml
COPY backend/auth-service/src ./backend/auth-service/src
RUN apk add --no-cache maven && mvn -f backend/auth-service/pom.xml clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/backend/auth-service/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
