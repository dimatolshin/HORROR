from django.db import models
from datetime import time, datetime, timedelta


def horror_image_directory_path(instance, filename):
    """Генерация пути для сохранения изображений по папкам"""
    return f"horrors/horror_{instance.horror.pk}/{filename}"


class Horror(models.Model):
    """Модель хоррора (квест-комната)"""
    name = models.CharField(max_length=255, verbose_name='Название квеста')
    registration_date = models.DateTimeField(auto_now_add=True, db_index=True, verbose_name="Дата регистрации квеста")
    novelty = models.BooleanField(default=False, verbose_name='Новинка или нет')
    description = models.TextField(blank=True, null=True, verbose_name='Описание квеста')
    location = models.CharField(max_length=255, blank=True, null=True, verbose_name='Локация квеста')
    rating = models.FloatField(default=0, verbose_name='Рейтинг квеста')
    travel_time = models.IntegerField(default=60, verbose_name="Примерное время, для прохождение квеста")
    fear = models.IntegerField(default=0, verbose_name='Уровень страха')
    complexity = models.IntegerField(default=0, verbose_name='Уровень сложности')
    count_players = models.CharField(max_length=30, verbose_name='Ограничения игроков для квеста')
    genre = models.CharField(max_length=50, verbose_name='Жанр квеста')
    rules = models.TextField(blank=True, null=True, verbose_name='Правила посещения')
    is_active = models.BooleanField(default=True, verbose_name='Активность квеста')
    id_mir_kvestov = models.BigIntegerField(null=True, blank=True)
    id_extrareality = models.CharField(null=True,blank=True)

    class Meta:
        verbose_name = 'Квесты'
        verbose_name_plural = 'Квесты'

    def __str__(self):
        return self.name


class Photo(models.Model):
    """Фотографии для каждого Horror"""
    horror = models.ForeignKey(Horror, on_delete=models.CASCADE, related_name="photos")
    image = models.ImageField(upload_to="horrors/")

    class Meta:
        verbose_name = 'Фото квестов'
        verbose_name_plural = 'Фото квестов'

    def __str__(self):
        return f"Фото {self.horror.name}"


class BackgroundPhotoCard(models.Model):
    """Фотографии для каждого Horror"""
    horror = models.ForeignKey(Horror, on_delete=models.CASCADE, related_name="photos_back_card")
    image = models.ImageField(upload_to="horrors/background_photo_card/")

    class Meta:
        verbose_name = 'Задний фон для квеста'
        verbose_name_plural = 'Задний фон для квеста'

    def __str__(self):
        return f"Фото фона{self.horror.name}"


class BlurPhoto(models.Model):
    """Фотографии для каждого Horror"""
    horror = models.ForeignKey(Horror, on_delete=models.CASCADE, related_name="photos_blur")
    image = models.ImageField(upload_to="horrors/blur/")

    class Meta:
        verbose_name = 'Логотип для квеста'
        verbose_name_plural = 'Логотип для квеста'

    def __str__(self):
        return f"Фото блюра{self.horror.name}"


class TimeSlot(models.Model):
    """Модель временных слотов для бронирования квестов"""
    time = models.TimeField(unique=True)

    class Meta:
        verbose_name = 'Время'
        verbose_name_plural = 'Время'

    def __str__(self):
        return self.time.strftime("%H:%M")


class TimeForHorror(models.Model):
    times = models.ManyToManyField(TimeSlot, related_name='times_in_tfh', verbose_name='Время', null=True,
                                   blank=True)
    horror = models.ForeignKey(Horror, related_name='horrors_in_tfh', on_delete=models.SET_NULL, verbose_name='Квест',
                               null=True,
                               blank=True)

    class Meta:
        verbose_name = 'Время и квесты'
        verbose_name_plural = 'Время и квесты'

    def __str__(self):
        if self.horror:
            return f'id:{self.id},horror_name{self.horror.name}'
        else:
            return f''


class Booking(models.Model):
    """Модель бронирования"""
    horror = models.ForeignKey(Horror, on_delete=models.CASCADE, related_name="bookings",
                               verbose_name='Квест для брони')
    data = models.DateField(null=True, blank=True, verbose_name="Дата бронирования ")
    slot = models.ForeignKey(TimeSlot, blank=True, null=True, on_delete=models.CASCADE, related_name="booking",
                             verbose_name='Дата-время брони')
    first_name = models.CharField(max_length=100, verbose_name='Имя клиента')
    last_name = models.CharField(max_length=100, verbose_name='Фамилия клиента')
    phone = models.CharField(max_length=20, verbose_name='Телефон клиента')
    certificate = models.BooleanField(default=False, verbose_name='Наличие сертификата')
    comment = models.TextField(blank=True, null=True, verbose_name='Комментарий клиента')
    price = models.IntegerField(blank=True, null=True, verbose_name='Цена за квест')
    bitrix_booking_id = models.IntegerField(null=True, blank=True)
    order_id_mir_kvestov = models.CharField(null=True, blank=True)
    order_id_extrareality = models.CharField(null=True,blank=True)


    class Meta:
        """Один слот в день — только один раз"""
        unique_together = ('data', 'slot')
        verbose_name = 'Бронирование'
        verbose_name_plural = 'Бронирование'

    def __str__(self):
        return f"{self.horror.name} - {self.first_name} {self.last_name}"
