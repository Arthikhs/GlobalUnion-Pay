FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY pom.xml ./pom.xml
COPY backend/fraud-service/pom.xml ./backend/fraud-service/pom.xml
COPY backend/fraud-service/src ./backend/fraud-service/src
RUN apk add --no-cache maven && mvn -f backend/fraud-service/pom.xml clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/backend/fraud-service/target/*.jar app.jar
EXPOSE 8088
ENTRYPOINT ["java", "-jar", "app.jar"]
