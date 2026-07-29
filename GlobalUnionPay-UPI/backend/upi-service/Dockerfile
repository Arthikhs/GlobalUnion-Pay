FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY pom.xml ./pom.xml
COPY backend/upi-service/pom.xml ./backend/upi-service/pom.xml
COPY backend/upi-service/src ./backend/upi-service/src
RUN apk add --no-cache maven && mvn -f backend/upi-service/pom.xml clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/backend/upi-service/target/*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]
