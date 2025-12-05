# Используем официальный образ Java 17
FROM eclipse-temurin:17-jdk-alpine

# Создаем том для временных файлов
VOLUME /tmp

# Открываем порт 8080
EXPOSE 8080

# Копируем JAR файл в контейнер
# ВАЖНО: Замените на имя вашего JAR файла после сборки
COPY build/libs/coinkeeper-0.0.1-SNAPSHOT.jar app.jar

# Команда для запуска приложения
ENTRYPOINT ["java","-jar","/app.jar"]

