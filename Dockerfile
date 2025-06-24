# Используем базовый образ Python 3.12
FROM python:3.12
# Команда для вывода логов в консоле
ENV PYTHONUNBUFFERED=1
# Устанавливаем рабочий каталог
WORKDIR /horror_core
# Копируем файл requirements.txt
COPY requirements.txt requirements.txt
# Экспортируем порт, который будет использоваться для доступа к приложению
EXPOSE 8000
# Устанавливаем часовой пояс Europe/Moscow
ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
# Устанавливаем локали
RUN apt update && apt install -y locales \
    && sed -i '/ru_RU.UTF-8/s/^# //g' /etc/locale.gen \
    && locale-gen \
    && update-locale LANG=ru_RU.UTF-8

# Устанавливаем переменные окружения для локали
ENV LANG=ru_RU.UTF-8
ENV LC_ALL=ru_RU.UTF-8
# Устанавливаем зависимости из файла requirements.txt без кэша
RUN pip install -r requirements.txt
# Копируем файлы и папки из папки CRM_system в рабочий каталог WORKDIR
COPY . .
# Запускаем Uvicorn сервер

CMD ["sh", "-c", "python manage.py migrate && uvicorn horror_core.asgi:application --host 0.0.0.0 & python app_horror/telegram.py"]
