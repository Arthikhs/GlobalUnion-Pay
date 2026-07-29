FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY pom.xml ./pom.xml
COPY backend/payment-service/pom.xml ./backend/payment-service/pom.xml
COPY backend/payment-service/src ./backend/payment-service/src
RUN apk add --no-cache maven && mvn -f backend/payment-service/pom.xml clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/backend/payment-service/target/*.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]
