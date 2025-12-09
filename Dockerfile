FROM python:3.12

ENV PYTHONUNBUFFERED=1

WORKDIR /horror_core


COPY requirements.txt requirements.txt

EXPOSE 8000

ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update && apt-get install -y locales \
    && sed -i '/ru_RU.UTF-8/s/^# //g' /etc/locale.gen \
    && locale-gen \
    && update-locale LANG=ru_RU.UTF-8 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*


ENV LANG=ru_RU.UTF-8
ENV LC_ALL=ru_RU.UTF-8

RUN pip install -r requirements.txt

COPY . .

CMD ["sh", "-c", "python manage.py migrate && python manage.py collectstatic --noinput && \
    uvicorn horror_core.asgi:application --workers 5 --host 0.0.0.0 --port 8000"]
