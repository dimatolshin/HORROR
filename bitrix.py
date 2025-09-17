import os
from datetime import datetime, timedelta
import django
from django.conf import settings
import requests
import json

# Настройка Django перед использованием
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'horror_core.settings')
django.setup()

BITRIX24_WEBHOOK = "https://quest-house.bitrix24.by/rest/9/2ocnjfm34ikt3j43/"

# Данные клиента
client_name = "Иван Петров"
client_phone = "+375299999999"

# Данные компании
company_title = "МирКвестов"


# Данные квеста


async def get_or_create_contact(name, phone):
    contact_search = {
        "filter": {"PHONE": phone,"NAME":name},
        "select": ["ID", "NAME", "PHONE"]
    }
    resp = requests.post(BITRIX24_WEBHOOK + "crm.contact.list.json", json=contact_search)
    data = resp.json()
    if data.get("result"):
        contact = data["result"][0]
        print("Найден контакт:", contact)
        return contact["ID"]

    payload = {
        "fields": {
            "NAME": name,
            "OPENED": "Y",
            "ASSIGNED_BY_ID": 1,
            "PHONE": [{"VALUE": phone, "VALUE_TYPE": "WORK"}]
        }
    }
    resp = requests.post(BITRIX24_WEBHOOK + "crm.contact.add.json", json=payload)
    data = resp.json()
    print("Создан контакт:", data)
    return data.get("result")


async def create_deal(horror_name, amount, count_of_peoples, contact_id, company_title, booking_start, comments):
    if not count_of_peoples:
        count_of_peoples = None
    with open('bitrix.json', 'r') as file:
        data = json.load(file)

    field = data[f"{horror_name}"].get('field')
    resource_id = data[f"{horror_name}"].get('resource_id')
    seconds = data[f"{horror_name}"].get('seconds')

    payload = {
        "fields": {
            "TITLE": f"Бронь квеста {horror_name}",
            "STAGE_ID": "NEW",
            "CATEGORY_ID": 0,
            "OPENED": "Y",
            "ASSIGNED_BY_ID": 1,
            "CONTACT_ID": contact_id,  # теперь клиент подтягивается
            "OPPORTUNITY": amount,
            "CURRENCY_ID": "BYN",
            "UF_CRM_1755698167": booking_start,  # дата/время
            f"{field}": f'resource|{resource_id}|{booking_start}|{seconds}|{horror_name}',
            "UF_CRM_1753868187382": count_of_peoples,  # количество участников
            "UF_CRM_1755782766": company_title,  # название компании
            "COMMENTS": comments,
        }
    }
    resp = requests.post(BITRIX24_WEBHOOK + "crm.deal.add.json", json=payload)
    print(resp.json())
    return resp.json().get('result')


async def get_booking_id_by_deal(deal_id, horror_name):
    with open('bitrix.json', 'r') as file:
        data = json.load(file)

    field = data[f"{horror_name}"].get('field')
    resp = requests.get(
        BITRIX24_WEBHOOK + "crm.deal.get.json",
        params={"id": deal_id}
    )
    data = resp.json()

    if "result" not in data:
        raise Exception(f"Ошибка: {data}")

    booking_id = int(data["result"].get(f"{field}")[0])

    respt = requests.get(
        BITRIX24_WEBHOOK + f"calendar.resource.booking.list/?filter[resourceIdList][]={booking_id}")
    data = respt.json()
    result_id = data['result'][0]['ID']

    return result_id, booking_id


async def get_data_by_booking_id(booking_id):
    respt = requests.get(
        BITRIX24_WEBHOOK + f"calendar.resource.booking.list/?filter[resourceIdList][]={booking_id}")
    print(respt.json())
    data = respt.json()
    date_str = data['result'][0]['DATE_FROM'].split(' ')[0]
    start_time_str = data['result'][0]['DATE_FROM'].split(' ')[1]
    date_obj = datetime.strptime(date_str, '%d.%m.%Y')
    start_time = datetime.strptime(start_time_str, "%H:%M:%S")
    date = date_obj.strftime('%Y-%m-%d')

    return date, start_time


async def get_name_by_booking_id(booking_id):
    respt = requests.get(
        BITRIX24_WEBHOOK + f"calendar.resource.booking.list/?filter[resourceIdList][]={booking_id}")
    data = respt.json()
    name = data['result'][0]['DESCRIPTION'].split(':')[1].replace(' ', '', 1)
    return name


async def get_client_id_and_price_and_count_peoples(booking_id,name):
    with open('bitrix.json', 'r') as file:
        data = json.load(file)
    resp = requests.get(
        BITRIX24_WEBHOOK + "crm.deal.list.json",
        params={
            f"filter[{data[name]['field']}]": booking_id,
            "select": ["*", "UF_*"]
        }
    )
    data = resp.json()
    price = int(float(data['result'][0]['OPPORTUNITY']))
    client_id = int(data['result'][0]['CONTACT_ID'])
    comment = data['result'][0]['COMMENTS'].strip()[3:-4]

    return price, client_id ,comment

async def get_name_and_phone_client(client_id):
    contact_search = {
        "filter": {"ID": client_id},
        "select": ["NAME", "PHONE"]
    }
    resp = requests.post(BITRIX24_WEBHOOK + "crm.contact.list.json", json=contact_search)
    data = resp.json()
    name = data.get("result")[0]['NAME']
    phone = data.get("result")[0]['PHONE'][0]['VALUE']

    return name, phone
