import asyncio
import os
import sys
import logging
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton,FSInputFile
from aiogram import Bot, Dispatcher, types, F
from aiogram.client.session.aiohttp import AiohttpSession
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart
from aiogram.client.default import DefaultBotProperties
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'horror_core.settings')
django.setup()
from app_horror.models import *
from dotenv import load_dotenv

load_dotenv()

# Bot token can be obtained via https://t.me/BotFather
TOKEN = os.getenv("TOKEN")

# Initialize Bot instance with default bot properties which will be passed to all API calls
bot = Bot(token=TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))

# All handlers should be attached to the Dispatcher
dp = Dispatcher()


def get_main_keyboard():
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="/reserv_quest"), KeyboardButton(text="/my_reserv")]
        ],
        resize_keyboard=True
    )

@dp.message(CommandStart())
async def handle_start(message: types.Message):
    await message.answer(
        "В данном боте можно забронировать техническую бронь на квест и посмотреть технические брони\n\n"
        "Бот будет отправлять вам уведомление как только кто-то забронирует место",
        parse_mode="HTML",
        reply_markup=get_main_keyboard()  # Добавляем клавиатуру
    )


@dp.message(Command("reserv_quest"))
async def handle_reserv_quest(message: types.Message):
    quests = [horror async for horror in Horror.objects.all()]
    # Создаем клавиатуру с кнопками
    buttons = [KeyboardButton(text=f"Квест: {quest.name}") for quest in quests]
    keyboard = ReplyKeyboardMarkup(
        keyboard=[buttons[i:i + 2] for i in range(0, len(buttons), 2)],
        resize_keyboard=True
    )

    await message.answer(
        "Выберите квест для бронирования:",
        reply_markup=keyboard
    )


# Обработчик выбора квеста
@dp.message(F.text.startswith("Квест"))
async def handle_quest_selection(message: types.Message):
    quest = message.text.split(": ")[1]
    times = await TimeForHorror.objects.filter(horror__name=quest).prefetch_related('times').afirst()
    buttons = [
        KeyboardButton(text=f"Время: {time} | Квест: {quest}")
        for time in times.times.all()
    ]
    keyboard = ReplyKeyboardMarkup(
        keyboard=[buttons[i:i + 2] for i in range(0, len(buttons), 2)],
        resize_keyboard=True
    )
    await message.answer(
        f"Выберите дату для бронирования:",
        reply_markup=keyboard
    )


@dp.message(F.text.startswith("Время:"))
async def handle_time_selection(message: types.Message, state: FSMContext):
    # Парсим время и квест из текста кнопки
    time_part, quest_part = message.text.split(" | ")
    time = time_part.split(": ")[1]  # "Время: 18:00" → "18:00"
    quest = quest_part.split(": ")[1]  # "Квест: Лабиринт" → "Лабиринт"
    await state.update_data(time=time)
    await state.update_data(quest=quest)

    await message.answer(
        "Теперь введите дату (например, 2024-05-20):",
        reply_markup=types.ReplyKeyboardRemove()  # Убираем клавиатуру
    )


@dp.message(F.text.regexp(r"\d{4}-\d{2}-\d{2}"))  # Проверяем формат даты
async def handle_date(message: types.Message, state: FSMContext):
    date = message.text
    data = await state.get_data()

    quest = data["quest"]
    time = data["time"]
    slot = await TimeSlot.objects.filter(time=time).afirst()
    horror = await Horror.objects.filter(name=quest).afirst()
    await Booking.objects.acreate(horror=horror, data=date, slot=slot, first_name='Резерв', last_name='Резерв',
                                  phone='111')
    await message.answer(
        f"✅ Бронь создана!\n"
        f"📅 Дата: {date}\n"
        f"⏰ Время: {time}\n"
        f"🎭 Квест: {quest}"
    )


@dp.message(Command("my_reserv"))
async def handle_reserv_quest(message: types.Message):
    # Получаем все технические брони
    my_arent = [arent async for arent in
               Booking.objects.filter(first_name='Резерв', last_name='Резерв')
               .select_related('horror', 'slot')
               .order_by('data')
               .all()]

    if not my_arent:
        await message.answer("У вас ещё нет технических броней.")
        return

    # Создаем временный файл
    with open('technical_bookings.txt', 'w', encoding='utf-8') as file:
        file.write("📋 Технические брони:\n\n")
        for i, booking in enumerate(my_arent, 1):
            file.write(
                f"{i}. 🎭 Квест: {booking.horror.name}\n"
                f"   📅 Дата: {booking.data}\n"
                f"   ⏰ Время: {booking.slot.time}\n"
            )

    # Отправляем файл пользователю
    document = FSInputFile('technical_bookings.txt', filename='technical_bookings.txt')
    await message.answer_document(document)
    os.remove('technical_bookings.txt')


async def main() -> None:
    # And the run events dispatching
    await dp.start_polling(bot)


async def send_message(msg, chat_id):
    async with AiohttpSession() as session:
        bot = Bot(token=TOKEN, session=session)
        return await bot.send_message(chat_id=chat_id, text=msg, parse_mode="HTML")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())
