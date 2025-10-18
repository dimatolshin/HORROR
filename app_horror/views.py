import locale
import time
from datetime import datetime, timedelta
from adrf.views import APIView
from asgiref.sync import sync_to_async
from django.http import JsonResponse
from psycopg2.extensions import JSONB
from rest_framework import status
from rest_framework.response import Response
from .models import *
from .serializers import HorrorSerializer, BookingSerializer, TimeSlotSerializer
from rest_framework.permissions import AllowAny
from telegram import send_message
from adrf.decorators import api_view
from django.utils import timezone
import pytz

from bitrix import *


class HorrorListView(APIView):
    """Вывод списка всех квестов"""

    async def get(self, request):
        horrors = []
        async for horror in Horror.objects.prefetch_related('photos', 'photos_back_card',
                                                            'photos_blur').order_by('-is_active',
                                                                                    'id').aiterator():  # Итерируем асинхронно
            horrors.append(horror)
        data = HorrorSerializer(horrors, many=True).data  # Сериализуем все
        return Response(data)


class HorrorDetailView(APIView):
    """Вывод детальной информации о квесте"""

    async def get(self, request, horror_id):
        horror = await Horror.objects.prefetch_related('photos', 'photos_back_card', 'photos_blur').filter(
            id=horror_id).afirst()  # Загружаем квест с фотографиями
        if not horror:
            return Response({"error": "Horror not found"}, status=404)

        data = HorrorSerializer(horror).data  # Сериализуем один
        return Response(data)


from django.db.models import Min, Avg, Max


class AvailableSlotsView(APIView):
    """Получение свободных временных слотов для конкретного хоррора на 30 дней вперед"""

    async def get(self, request, horror_id):
        today = datetime.today().date()
        dates = [today + timedelta(days=i) for i in range(30)]
        result = []

        for date in dates:
            weekday = date.weekday()
            # Получаем уникальные времена для данного дня
            times = (
                await sync_to_async(list)(
                    TimeSlot.objects.filter(
                        times_in_tfh__horror__id=horror_id,
                        day=weekday,
                    )
                    .values_list("time", flat=True)
                    .distinct()
                    .order_by("time")
                )
            )

            # Список забронированных слотов
            booked_slots = []
            async for slot_id in Booking.objects.filter(
                    horror_id=horror_id, data=date
            ).values_list("slot_id", flat=True).aiterator():
                booked_slots.append(slot_id)

            slots_for_date = []
            for slot_time in times:
                # Получаем все варианты для данного времени
                price_and_count = TimeSlot.objects.filter(
                    times_in_tfh__horror__id=horror_id,
                    day=weekday,
                    time=slot_time
                ).order_by("count_of_peoples")

                info = []
                async for item in price_and_count.aiterator():
                    info.append({
                        "id": item.id,
                        "count_of_peoples": item.count_of_peoples,
                        "price": item.price
                    })

                # Берём первый слот только для получения id (если нужно)
                current_flag = False
                first_slot = await price_and_count.afirst()
                if date == today:
                    future_datetime = timezone.now() + timedelta(minutes=30)
                    slot_datetime = timezone.make_aware(
                        datetime.combine(timezone.now().date(), slot_time)
                    )
                    current_flag = future_datetime > slot_datetime
                if current_flag:
                    flag = True

                if not current_flag and first_slot.id in booked_slots:
                    flag = True

                if not current_flag and first_slot.id not in booked_slots:
                    flag = False

                slots_for_date.append({
                    "time": slot_time.strftime("%H:%M"),
                    "info": info,
                    "color": first_slot.color,
                    "is_booked": flag,
                })

            result.append({
                "date": self.format_date(date),
                "date_front": date.isoformat(),
                "slots": slots_for_date
            })

        return Response(result)

    def format_date(self, date):
        """Форматируем дату в формат '25 Ноября Пн'"""
        # Устанавливаем локаль на русскую
        locale.setlocale(locale.LC_TIME, "ru_RU.UTF-8")
        # Список названий дней недели
        weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
        # Форматируем дату
        return f"{date.day} {date.strftime('%B').capitalize()} {weekdays[date.weekday()]}"


@api_view(["POST"])
async def booking_endpoint(request):
    horror_id = request.data.get("horror")
    data = request.data.get("data")
    phone = request.data.get("phone")
    slot = request.data.get("slot")
    first_name = request.data.get("first_name")
    last_name = request.data.get("last_name")
    certificate = request.data.get("certificate")
    if not certificate:
        certificate = False
    comment = request.data.get("comment")
    if not comment:
        comment = ''
    price = request.data.get("price")
    count_of_peoples = request.data.get("count_of_peoples")
    older_14 = request.data.get("older_14")

    peoples = [521662459, 5235284862, 605787781, 602753713]

    horror = await Horror.objects.filter(id=horror_id).afirst()

    time = await TimeSlot.objects.filter(id=slot).afirst()

    await Booking.objects.acreate(horror=horror, data=data, slot=time, first_name=first_name, last_name=last_name,
                                  phone=phone, certificate=certificate, comment=comment, price=price,
                                  count_of_peoples=count_of_peoples)

    booking= await Booking.objects.filter(horror=horror, slot=time).afirst()
    msg = (
        f"Поступила бронь на квест '{horror.name}' (ID брони {booking.id})\n\n"
        f"Дата игры: {data} {time.time}\n\n"
        f"Имя: {first_name} {last_name}\n\n"
        f"Телефон: {phone}\n\n"
        f"Стоимость: {price}\n\n"
        f"Выбранный режим:  Игра для {count_of_peoples} человек \n\n"
        f"Комментарий: {comment}\n\n"
        f"Источник: quest-house.by\n\n"

    )
    for id in peoples:
        try:
            await send_message(msg=msg, chat_id=id)
        except Exception:
            continue
    booking_start = datetime.strptime(f"{data} {time.time}", "%Y-%m-%d %H:%M:%S")
    print("booking_start", booking_start)
    formatted_booking_start = booking_start.strftime("%d.%m.%Y %H:%M:%S")
    print("formatted_booking_start:", formatted_booking_start)
    name = f"{first_name} {last_name}"
    phone = f"{phone}"
    price = f"{price}"
    company_title = 'My horror site'
    contact_id = await get_or_create_contact(name=name, phone=phone)
    print("contact_id:", contact_id)
    deal_id = await create_deal(horror_name=horror.name, amount=price, contact_id=contact_id,
                                company_title=company_title,
                                comments=comment, booking_start=formatted_booking_start,
                                count_of_peoples=count_of_peoples, old_person=older_14)
    result_id, booking_id = await get_booking_id_by_deal(deal_id=deal_id, horror_name=horror.name)
    booking.bitrix_booking_id = booking_id
    booking.result_id = result_id
    await booking.asave()
    return JsonResponse({'Info':'Success'},status=200)


# class BookingCreateView(APIView):
#     """Представление для создания брони"""
#     permission_classes = [AllowAny]
#
#     async def post(self, request, *args, **kwargs):
#         peoples = [521662459, 5235284862, 605787781, 602753713]
#         data = request.data.copy()
#         old_person = data.pop("old_person", False)
#         serializer = BookingSerializer(data=data)
#
#         try:
#             is_valid = await sync_to_async(serializer.is_valid)()
#
#             if is_valid:
#                 booking = await sync_to_async(serializer.save)()
#
#                 horror = await Horror.objects.filter(id=data.get('horror')).afirst()
#
#                 time = await TimeSlot.objects.filter(id=data.get('slot')).afirst()
#
#                 msg = (
#                     f"Поступила бронь на квест '{horror.name}' (ID брони {booking.id})\n\n"
#                     f"Дата игры: {data.get('data', '')} {time.time}\n\n"
#                     f"Имя: {data.get('first_name', '')} {data.get('last_name', '')}\n\n"
#                     f"Телефон: {data.get('phone')}\n\n"
#                     f"Стоимость: {data.get('price', '')}\n\n"
#                     f"Выбранный режим:  Игра для {data.get('count_of_peoples')} человек \n\n"
#                     f"Комментарий: {data.get('comment', '')}\n\n"
#                     f"Источник: quest-house.by\n\n"
#
#                 )
#                 for id in peoples:
#                     try:
#                         await send_message(msg=msg, chat_id=id)
#                     except Exception:
#                         continue
#                 print('data:', data.get('data', ''))
#                 booking_start = datetime.strptime(f"{data.get('data', '')} {time.time}", "%Y-%m-%d %H:%M:%S")
#                 print("booking_start", booking_start)
#                 formatted_booking_start = booking_start.strftime("%d.%m.%Y %H:%M:%S")
#                 print("formatted_booking_start:", formatted_booking_start)
#                 name = f"{data.get('first_name', '')} {data.get('last_name', '')}"
#                 phone = f"{data.get('phone', '')}"
#                 price = f"{data.get('price', '')}"
#                 comment = data.get('comment', '')
#                 company_title = 'My horror site'
#                 contact_id = await get_or_create_contact(name=name, phone=phone)
#                 print("contact_id:", contact_id)
#                 deal_id = await create_deal(horror_name=horror.name, amount=price, contact_id=contact_id,
#                                             company_title=company_title,
#                                             comments=comment, booking_start=formatted_booking_start,
#                                             count_of_peoples=data.get('count_of_peoples'), old_person=old_person)
#                 result_id, booking_id = await get_booking_id_by_deal(deal_id=deal_id, horror_name=horror.name)
#                 book = await Booking.objects.filter(horror=horror, data=data.get('data'), slot=time).afirst()
#                 book.bitrix_booking_id = booking_id
#                 book.result_id = result_id
#                 await book.asave()
#                 return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)
#
#             print("Serializer errors:", serializer.errors)
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#         except Exception as e:
#             print("Error:", str(e))
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SlotsListView(APIView):
    """Вывод списка всех временных слотов квестов"""

    async def post(self, request, *args, **kwargs):
        horror_id = request.data.get('horror_id')
        horror = await Horror.objects.filter(id=horror_id).afirst()
        if horror:
            time_for_horror = await TimeForHorror.objects.filter(horror=horror).prefetch_related('times').order_by(
                'times__time').afirst()
            slots = [h async for h in time_for_horror.times.all()]
            data = TimeSlotSerializer(slots, many=True).data
            return Response(data)
        else:
            return Response({'Error': 'Данного квеста нет'}, status=status.HTTP_404_NOT_FOUND)


@api_view(["GET"])
async def give_data_mir_kvestov(request, id_mir_kvestov):
    today = datetime.today().date()
    dates = [today + timedelta(days=i) for i in range(14)]
    result = []
    horror = await Horror.objects.filter(id_mir_kvestov=id_mir_kvestov).afirst()
    if not horror:
        return Response({'Error': 'Horror not exist'}, status=404)

    for date in dates:
        weekday = date.weekday()
        # Получаем уникальные времена для данного дня
        times = (
            await sync_to_async(list)(
                TimeSlot.objects.filter(
                    times_in_tfh__horror__id_mir_kvestov=id_mir_kvestov,
                    day=weekday,
                )
                .values_list("time", flat=True)
                .distinct()
                .order_by("time")
            )
        )

        # Список забронированных слотов
        booked_slots = []
        async for slot_id in Booking.objects.filter(
                horror__id_mir_kvestov=id_mir_kvestov, data=date
        ).values_list("slot_id", flat=True).aiterator():
            booked_slots.append(slot_id)

        slots_for_date = []
        for slot_time in times:
            # Получаем все варианты для данного времени
            price_and_count = TimeSlot.objects.filter(
                times_in_tfh__horror__id_mir_kvestov=id_mir_kvestov,
                day=weekday,
                time=slot_time
            ).order_by("count_of_peoples")

            info = []
            async for item in price_and_count.aiterator():
                info.append({
                    "count_of_peoples": item.count_of_peoples,
                    "price": item.price
                })

            # Берём первый слот только для получения id (если нужно)
            current_flag = False
            first_slot = await price_and_count.afirst()
            if date == today:
                future_datetime = timezone.now() + timedelta(minutes=30)
                slot_datetime = timezone.make_aware(
                    datetime.combine(timezone.now().date(), slot_time)
                )
                current_flag = future_datetime > slot_datetime
            if current_flag:
                flag = False

            if not current_flag and first_slot.id in booked_slots:
                flag = False

            if not current_flag and first_slot.id not in booked_slots:
                flag = True

            result.append({
                "date": date.isoformat(),
                "time": slot_time,
                "price": info[0]['price'],
                "is_free": flag,
                "your_slot_id": weekday
            })

    return Response(result)


@api_view(["POST"])
async def take_data_mir_kvestov(request, id_mir_kvestov):
    first_name = request.data["first_name"]
    family_name = request.data["family_name"]
    phone = request.data["phone"]
    comment = request.data["comment"]
    date = request.data["date"]
    source = request.data["source"]
    time = request.data["time"]
    price = request.data["price"]
    day = request.data["your_slot_id"]
    unique_id = request.data["unique_id"]

    horror = await Horror.objects.filter(id=id_mir_kvestov).afirst()
    slot = await TimeSlot.objects.filter(time=time, day=day).afirst()

    if not slot:
        return Response({"success": False, "message": "Указанное время для брони не существует"}, status=404)

    if not horror:
        return Response({"success": False, "message": "Horror not exist"}, status=404)

    booking = await Booking.objects.filter(horror=horror, data=date, slot=slot).afirst()

    if booking:
        return Response({"success": False, "message": "Указанное время занято"}, status=404)

    await Booking.objects.acreate(horror=horror, data=date, slot=slot, first_name=first_name, last_name=family_name,
                                  phone=phone, comment=comment, price=price, order_id_mir_kvestov=unique_id)

    name = f'{first_name} {family_name}'
    booking_start = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")
    formatted_booking_start = booking_start.strftime("%d.%m.%Y %H:%M:%S")
    contact_id = await get_or_create_contact(name=name, phone=phone)
    deal_id = await create_deal(horror_name=horror.name, amount=price, contact_id=contact_id, company_title=source,
                                comments=comment, booking_start=formatted_booking_start, count_of_peoples=None,
                                old_person=False)
    result_id, booking_id = await get_booking_id_by_deal(deal_id=deal_id, horror_name=horror.name)
    book = await Booking.objects.filter(horror=horror, data=date, slot=slot).afirst()
    book.bitrix_booking_id = booking_id
    book.result_id = result_id
    await book.asave()
    peoples = [521662459, 883664955, 5235284862, 605787781, 602753713]

    msg = (
        f"Поступила бронь на квест '{horror.name}' (ID брони {unique_id})\n\n"
        f"Дата игры: {date} {slot.time}\n\n"
        f"Имя: {name}\n\n"
        f"Телефон: {phone}\n\n"
        f"Стоимость: {price}\n\n"
        f"Комментарий: {comment}\n\n"
        f"Источник: Мир Квестов\n\n"

    )

    for id in peoples:
        try:
            await send_message(msg=msg, chat_id=id)
        except Exception:
            continue
    return Response({"success": True}, status=200)


@api_view(["POST"])
async def take_bitrix_data(request):
    result_id = request.POST.get('data[id]')
    print("result_id:", result_id)
    booking = await Booking.objects.filter(result_id=result_id).afirst()

    if not booking:
        return Response({"Error": 'Такой брони не существует'}, status=404)

    date, start_time = await get_data_by_booking_id(booking_id=booking.bitrix_booking_id)

    slot = await TimeSlot.objects.filter(time=start_time).afirst()

    if slot:
        booking.slot = slot
    booking.data = date
    await booking.asave()

    return Response({"success": True}, status=200)


@api_view(["POST"])
async def delete_bitrix_data(request):
    result_id = request.POST.get('data[id]')
    print("result_id:", result_id)
    booking = await Booking.objects.filter(result_id=result_id).afirst()

    if not booking:
        return Response({"Error": 'Такой брони не существует'}, status=404)

    await booking.adelete()

    return Response({"success": True}, status=200)


@api_view(["POST"])
async def create_bitrix_data(request):
    result_id = int(request.POST.get('data[id]'))
    my_count = 8
    max_attempts = 10
    attempts = 0
    while attempts < max_attempts:
        try:
            booking_id = result_id - my_count
            date, start_time = await get_data_by_booking_id(booking_id=booking_id)
            break
        except Exception:
            my_count += 2
            attempts += 1
            print(f"Попытка {attempts}: booking_id {booking_id} не найден, увеличиваем счетчик")
    else:
        print("Не удалось найти подходящий booking_id после всех попыток")

    name = await get_name_by_booking_id(booking_id=booking_id)

    horror = await Horror.objects.filter(name=name).afirst()
    if not horror:
        return Response({'Error': 'Данного хорра не существует'}, status=404)

    slot = await TimeSlot.objects.filter(time=start_time).afirst()
    if not horror:
        return Response({'Error': 'Данного времени не существует'}, status=404)

    booking = await Booking.objects.filter(horror=horror, data=date, slot=slot).afirst()

    if not booking:
        price, client_id, comment = await get_client_id_and_price_and_count_peoples(booking_id, name)
        name, phone = await get_name_and_phone_client(client_id)
        await Booking.objects.acreate(horror=horror, data=date, slot=slot, bitrix_booking_id=booking_id,
                                      result_id=result_id, first_name=name, phone=phone, price=price)
        booking = await Booking.objects.filter(horror=horror, data=date, slot=slot,
                                               bitrix_booking_id=booking_id).afirst()

        peoples = [521662459, 883664955, 5235284862, 605787781, 602753713]
        msg = (
            f"Поступила бронь на квест '{horror.name}' (ID брони {booking.id})\n\n"
            f"Дата игры: {date} {slot.time}\n\n"
            f"Имя: {name}\n\n"
            f"Телефон: {phone}\n\n"
            f"Стоимость: {price}\n\n"
            f"Комментарий: {comment}\n\n"
            f"Источник: Bitrix\n\n"

        )
        for id in peoples:
            try:
                await send_message(msg=msg, chat_id=id)
            except Exception:
                continue

    return Response({"success": True}, status=200)


@api_view(["GET"])
async def give_data_extrareality(request, id_extrareality):
    today = datetime.today().date()
    dates = [today + timedelta(days=i) for i in range(14)]
    result = []
    horror = await Horror.objects.filter(id_extrareality=id_extrareality).afirst()
    if not horror:
        return Response({'Error': 'Horror not exist'}, status=404)

    for date in dates:
        weekday = date.weekday()
        # Получаем уникальные времена для данного дня
        times = (
            await sync_to_async(list)(
                TimeSlot.objects.filter(
                    times_in_tfh__horror__id_extrareality=id_extrareality,
                    day=weekday,
                )
                .values_list("time", flat=True)
                .distinct()
                .order_by("time")
            )
        )

        # Список забронированных слотов
        booked_slots = []
        async for slot_id in Booking.objects.filter(
                horror__id_extrareality=id_extrareality, data=date
        ).values_list("slot_id", flat=True).aiterator():
            booked_slots.append(slot_id)

        slots_for_date = []
        for slot_time in times:
            # Получаем все варианты для данного времени
            price_and_count = TimeSlot.objects.filter(
                times_in_tfh__horror__id_extrareality=id_extrareality,
                day=weekday,
                time=slot_time
            ).order_by("count_of_peoples")

            info = {}
            async for item in price_and_count.aiterator():
                info[item.count_of_peoples] = item.price

            # Берём первый слот только для получения id (если нужно)
            current_flag = False
            first_slot = await price_and_count.afirst()
            if date == today:
                future_datetime = timezone.now() + timedelta(minutes=30)
                slot_datetime = timezone.make_aware(
                    datetime.combine(timezone.now().date(), slot_time)
                )
                current_flag = future_datetime > slot_datetime
            if current_flag:
                flag = False

            if not current_flag and first_slot.id in booked_slots:
                flag = False

            if not current_flag and first_slot.id not in booked_slots:
                flag = True

            result.append({
                "date": date.isoformat(),
                "time": slot_time,
                "is_free": flag,
                "extraPrices": info,
                "our_time_id": weekday
            })

    return Response(result)


@api_view(["POST"])
async def take_data_extrareality(request, id_extrareality):
    comment = request.data["comment"]
    data = request.data["datetime"]
    name = request.data["name"]
    phone = request.data["phone"]
    players_num = int(request.data["players_num"])
    source = request.data["source"]
    price = request.data["price"]
    uid = request.data["uid"]
    day = request.data["our_time_id"]

    horror = await Horror.objects.filter(id_extrareality=id_extrareality).afirst()
    date_str = data.split(" ")[0]
    date = datetime.strptime(date_str, '%Y-%m-%d')
    time = data.split(" ")[1]
    slot = await TimeSlot.objects.filter(time=time, day=day).afirst()

    if not slot:
        return Response({"success": False, "message": "Указанное время для брони не существует"}, status=404)

    if not horror:
        return Response({"success": False, "message": "Horror not exist"}, status=404)

    booking = await Booking.objects.filter(horror=horror, data=date, slot=slot).afirst()

    if booking:
        return Response({"success": False, "message": "Указанное время занято"}, status=404)

    await Booking.objects.acreate(horror=horror, data=date, slot=slot, first_name=name, phone=phone, comment=comment,
                                  price=price, order_id_extrareality=uid, count_of_peoples=players_num)

    datetime_obj = datetime.strptime(data, "%Y-%m-%d %H:%M:%S")
    formatted_booking_start = datetime_obj.strftime("%d.%m.%Y %H:%M:%S")

    contact_id = await get_or_create_contact(name=name, phone=phone)
    deal_id = await create_deal(horror_name=horror.name, amount=price, contact_id=contact_id, company_title=source,
                                comments=comment, booking_start=formatted_booking_start, count_of_peoples=players_num,
                                old_person=False)
    result_id, booking_id = await get_booking_id_by_deal(deal_id=deal_id, horror_name=horror.name)
    book = await Booking.objects.filter(horror=horror, data=date, slot=slot).afirst()
    book.bitrix_booking_id = booking_id
    book.result_id = result_id
    await book.asave()
    peoples = [521662459, 883664955, 5235284862, 605787781, 602753713]
    msg = (
        f"Поступила бронь на квест '{horror.name}' (ID брони {book.id})\n\n"
        f"Дата игры: {date} {slot.time}\n\n"
        f"Имя: {name}\n\n"
        f"Телефон: {phone}\n\n"
        f"Стоимость: {price}\n\n"
        f"Комментарий: {comment}\n\n"
        f"Выбранный режим: Игра для {players_num} человек\n\n"
        f"Источник: Extrareality\n\n"

    )
    for id in peoples:
        try:
            await send_message(msg=msg, chat_id=id)
        except Exception:
            continue
    return Response({"success": True}, status=200)


@api_view(["POST"])
async def take_later_data_quest(request):
    horror_id = request.data.get("horror")
    data = request.data.get("data")
    phone = request.data.get("phone")
    time = request.data.get("time")
    first_name = request.data.get("first_name")
    last_name = request.data.get("last_name")
    certificate = request.data.get("certificate")
    if not certificate:
        certificate = False
    comment = request.data.get("comment")
    if not comment:
        comment = ''
    price = request.data.get("price")
    count_of_peoples = request.data.get("count_of_peoples")
    older_14 = request.data.get("older_14")

    peoples = [521662459, 883664955, 5235284862, 605787781, 602753713]
    horror = await Horror.objects.filter(id=horror_id).afirst()
    if certificate:
        certificate = 'Имеется'
    if not certificate:
        certificate = 'Не Имеется'
    msg = (
        f"Поступила бронь на квест '{horror.name}' на более позднюю дату)\n\n"
        f"Дата игры: {data} {time}\n\n"
        f"Имя: {first_name} {last_name}\n\n"
        f"Телефон: {phone}\n\n"
        f"Стоимость: {price}\n\n"
        f"Комментарий: {comment}\n\n"
        f"Сертификат: {certificate}\n\n"
        f"Выбранный режим: Игра для {count_of_peoples} человек\n\n"
        f"Источник: Extrareality\n\n"

    )
    for id in peoples:
        try:
            await send_message(msg=msg, chat_id=id)
        except Exception:
            continue
    return Response({"success": True}, status=200)
