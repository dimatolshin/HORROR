import locale
from datetime import datetime, timedelta
from adrf.views import APIView
from rest_framework import status
from rest_framework.response import Response
from app_horror.models import TimeSlot, Booking, Horror
from app_horror.serializers import HorrorSerializer, BookingSerializer, TimeSlotSerializer
from rest_framework.permissions import AllowAny


class HorrorListView(APIView):
    """Вывод списка всех квестов"""
    async def get(self, request):
        horrors = []
        async for horror in Horror.objects.prefetch_related('photos', 'photos_back_card', 'photos_blur').aiterator():  # Итерируем асинхронно
            horrors.append(horror)
        data = HorrorSerializer(horrors, many=True).data  # Сериализуем все
        return Response(data)


class HorrorDetailView(APIView):
    """Вывод детальной информации о квесте"""
    async def get(self, request, horror_id):
        horror = await Horror.objects.prefetch_related('photos', 'photos_back_card', 'photos_blur').filter(id=horror_id).afirst()  # Загружаем квест с фотографиями
        if not horror:
            return Response({"error": "Horror not found"}, status=404)

        data = HorrorSerializer(horror).data  # Сериализуем один
        return Response(data)


class AvailableSlotsView(APIView):
    """Получение свободных временных слотов для конкретного хоррора на 30 дней вперед"""
    async def get(self, request, horror_id):
        # Получаем сегодняшнюю дату
        today = datetime.today().date()
        # Генерируем список дат на 30 дней вперед
        dates = [today + timedelta(days=i) for i in range(30)]
        # Получаем все слоты
        slots = TimeSlot.objects.order_by("time")
        # Формируем ответ
        result = []
        for date in dates:
            # Получаем забронированные слоты для текущей даты (асинхронно)
            booked_slots = []
            async for slot_id in Booking.objects.filter(horror_id=horror_id, data=date).values_list("slot_id", flat=True).aiterator():
                booked_slots.append(slot_id)
            # Формируем слоты для текущей даты
            slots_for_date = []
            async for slot in slots.aiterator():
                slot_time = slot.time.strftime("%H:%M")
                # Убираем слот "23:50" для всех дней, кроме пятницы и субботы
                if slot_time == "23:50" and date.weekday() not in [4, 5]:  # 4 - пятница, 5 - суббота
                    continue
                slots_for_date.append({"time": slot_time,"price": self.get_slot_price(slot_time, date),
                                       "is_booked": slot.id in booked_slots})
            # Добавляем дату и слоты в результат
            result.append({"date": self.format_date(date),"date_front": date.isoformat(), "slots": slots_for_date})
        return Response(result)

    def get_slot_price(self, slot_time, booking_date):
        """Функция возвращает цену для конкретного слота и даты"""
        weekday = booking_date.weekday()  # 0 - Пн, 1 - Вт ... 6 - Вс
        # Базовая цена
        base_price = 110
        # Если слот попадает в вечер пятницы, субботы или воскресенья (13:30 - 22:30)
        if weekday in [4, 5, 6] and "13:30" <= slot_time <= "22:30":
            return 120
        # Если пятница или суббота и время 23:50
        if weekday in [4, 5] and slot_time == "23:50":
            return 140
        return base_price

    def format_date(self, date):
        """Форматируем дату в формат '25 Ноября Пн'"""
        # Устанавливаем локаль на русскую
        locale.setlocale(locale.LC_TIME, "ru_RU.UTF-8")
        # Список названий дней недели
        weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
        # Форматируем дату
        return f"{date.day} {date.strftime('%B').capitalize()} {weekdays[date.weekday()]}"


class BookingCreateView(APIView):
    """Представление для создания брони"""
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        print("Request data:", request.data)
        # Получаем данные из тела запроса
        serializer = BookingSerializer(data=request.data)
        # Проверяем, что данные валидны
        if serializer.is_valid():
            # Создаем запись брони
            booking = serializer.save()
            return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)
        print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SlotsListView(APIView):
    """Вывод списка всех временных слотов квестов"""
    async def get(self, request):
        slots = [h async for h in TimeSlot.objects.all()]
        data = TimeSlotSerializer(slots, many=True).data
        return Response(data)
