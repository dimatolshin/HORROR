import asyncio
import os
import sys
import logging
from aiogram import Bot, Dispatcher, types
from aiogram.client.session.aiohttp import AiohttpSession
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart
from aiogram.types import InlineKeyboardButton, WebAppInfo, InlineKeyboardMarkup
from aiogram.client.default import DefaultBotProperties
from dotenv import load_dotenv

load_dotenv()

# Bot token can be obtained via https://t.me/BotFather
TOKEN = os.getenv("TOKEN")

# Initialize Bot instance with default bot properties which will be passed to all API calls
bot = Bot(token=TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))

# All handlers should be attached to the Dispatcher
dp = Dispatcher()


@dp.message(CommandStart())
async def handle_start(message: types.Message):
    await message.answer(
    "В данном боте можно забронировать техническую бронь на квест /reserv_quest\n\n"
    "Бот будет отправлять вам уведомление как только кто-то забронирует место",
    parse_mode="HTML"
)


async def main() -> None:
    # And the run events dispatching
    await dp.start_polling(bot)


async def send_message(msg,chat_id):
    async with AiohttpSession() as session:
        bot = Bot(token=TOKEN, session=session)
        return await bot.send_message(chat_id=chat_id, text=msg, parse_mode="HTML")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())
