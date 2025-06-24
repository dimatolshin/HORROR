from django.contrib import admin
from .models import *


@admin.register(Horror)
class HorrorAdmin(admin.ModelAdmin):
    """Регистрация в админ панели модели Horror."""
    list_display = [field.name for field in Horror._meta.fields]


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    """Регистрация в админ панели модели Photo."""
    list_display = [field.name for field in Photo._meta.fields]


@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    """Регистрация в админ панели модели TimeSlot."""
    list_display = [field.name for field in TimeSlot._meta.fields]


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    """Регистрация в админ панели модели TimeSlot."""
    list_display = [field.name for field in Booking._meta.fields]



@admin.register(BackgroundPhotoCard)
class BackgroundPhotoCardAdmin(admin.ModelAdmin):
    """Регистрация в админ панели модели TimeSlot."""
    list_display = [field.name for field in BackgroundPhotoCard._meta.fields]



@admin.register(BlurPhoto)
class BlurPhotoAdmin(admin.ModelAdmin):
    """Регистрация в админ панели модели TimeSlot."""
    list_display = [field.name for field in BlurPhoto._meta.fields]


@admin.register(TimeForHorror)
class TimeForHorrorAdmin(admin.ModelAdmin):
    """Регистрация в админ панели модели TimeSlot."""
    list_display = [field.name for field in TimeForHorror._meta.fields]