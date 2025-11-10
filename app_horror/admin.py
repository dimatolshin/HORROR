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
    search_fields = ('name',)
    list_display = [field.name for field in TimeSlot._meta.fields]
    ordering = ('day', 'time', 'name')  # ✅ Сначала по дню, потом по времени, потом по имени

    def get_search_results(self, request, queryset, search_term):
        """
        Исключает уже выбранные значения из autocomplete и сортирует по дням недели.
        """
        queryset, use_distinct = super().get_search_results(request, queryset, search_term)

        # Исключаем уже выбранные значения (если они переданы)
        selected = request.GET.getlist('_exclude_ids[]')
        if selected:
            queryset = queryset.exclude(pk__in=selected)

        # 🔽 Гарантированная сортировка (на случай, если ordering не сработает при поиске)
        queryset = queryset.order_by('day', 'time', 'name')

        return queryset, use_distinct

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


from django import forms

class TimeForHorrorForm(forms.ModelForm):
    times = forms.ModelMultipleChoiceField(
        queryset=TimeSlot.objects.all(),
        widget=admin.widgets.FilteredSelectMultiple(verbose_name='Время', is_stacked=False)
    )

    class Meta:
        model = TimeForHorror
        fields = '__all__'



@admin.register(TimeForHorror)
class TimeForHorrorAdmin(admin.ModelAdmin):
    form = TimeForHorrorForm
    list_display = [field.name for field in TimeForHorror._meta.fields]