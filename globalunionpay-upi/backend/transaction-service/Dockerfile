FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY pom.xml ./pom.xml
COPY backend/transaction-service/pom.xml ./backend/transaction-service/pom.xml
COPY backend/transaction-service/src ./backend/transaction-service/src
RUN apk add --no-cache maven && mvn -f backend/transaction-service/pom.xml clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/backend/transaction-service/target/*.jar app.jar
EXPOSE 8086
ENTRYPOINT ["java", "-jar", "app.jar"]
