FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY pom.xml ./pom.xml
COPY backend/merchant-service/pom.xml ./backend/merchant-service/pom.xml
COPY backend/merchant-service/src ./backend/merchant-service/src
RUN apk add --no-cache maven && mvn -f backend/merchant-service/pom.xml clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/backend/merchant-service/target/*.jar app.jar
EXPOSE 8088
ENTRYPOINT ["java", "-jar", "app.jar"]
