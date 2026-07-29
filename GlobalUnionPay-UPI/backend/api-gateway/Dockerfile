FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY pom.xml ./pom.xml
COPY backend/api-gateway/pom.xml ./backend/api-gateway/pom.xml
COPY backend/api-gateway/src ./backend/api-gateway/src
RUN apk add --no-cache maven && mvn -f backend/api-gateway/pom.xml clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/backend/api-gateway/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
