FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY pom.xml ./pom.xml
COPY backend/wallet-service/pom.xml ./backend/wallet-service/pom.xml
COPY backend/wallet-service/src ./backend/wallet-service/src
RUN apk add --no-cache maven && mvn -f backend/wallet-service/pom.xml clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/backend/wallet-service/target/*.jar app.jar
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "app.jar"]
