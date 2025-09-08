import requests

webhook = "https://quest-house.bitrix24.by/rest/9/2ocnjfm34ikt3j43/"

resp = requests.get(
    webhook + "crm.deal.get.json",
    params={"id": '193'}
)
data = resp.json()
print('data: ', data)

if "result" not in data:
    raise Exception(f"Ошибка: {data}")

booking_id = int(data["result"].get("UF_CRM_1756290475")[0])
print('booking_id:', booking_id)

respt = requests.get(
    webhook + f"calendar.resource.booking.list/?filter[resourceIdList][]={booking_id}")
print(respt.json())
data = respt.json()

print(data['result'][0]['DATE_FROM'])

data = {'result': [
    {'ID': '71', 'PARENT_ID': '71', 'ACTIVE': 'Y', 'DELETED': 'N', 'CAL_TYPE': 'resource', 'OWNER_ID': '0',
     'NAME': 'Бронирование: Тест', 'DATE_FROM': '14.09.2025 19:00:00', 'DATE_TO': '14.09.2025 20:30:00',
     'ORIGINAL_DATE_FROM': None, 'TZ_FROM': 'Europe/Moscow', 'TZ_TO': 'Europe/Moscow', 'TZ_OFFSET_FROM': '10800',
     'TZ_OFFSET_TO': '10800', 'DATE_FROM_TS_UTC': '1757854800', 'DATE_TO_TS_UTC': '1757860200', 'DT_SKIP_TIME': 'N',
     'DT_LENGTH': 5400, 'EVENT_TYPE': '#resourcebooking#', 'CREATED_BY': '1', 'DATE_CREATE': '02.09.2025 13:43:15',
     'TIMESTAMP_X': '08.09.2025 09:30:26', 'DESCRIPTION': 'Услуга: Заклятие', 'DT_FROM': None, 'DT_TO': None,
     'PRIVATE_EVENT': '', 'ACCESSIBILITY': 'busy', 'IMPORTANCE': 'normal', 'IS_MEETING': False, 'MEETING_STATUS': 'Y',
     'MEETING_HOST': '0', 'MEETING': None, 'LOCATION': '', 'REMIND': [], 'COLOR': '', 'TEXT_COLOR': '', 'RRULE': '',
     'EXDATE': '', 'DAV_XML_ID': '', 'G_EVENT_ID': '', 'DAV_EXCH_LABEL': '', 'CAL_DAV_LABEL': '', 'VERSION': '1',
     'ATTENDEES_CODES': None, 'RECURRENCE_ID': None, 'RELATIONS': '', 'SECTION_ID': '27', 'SYNC_STATUS': None,
     'UF_CRM_CAL_EVENT': False, 'UF_WEBDAV_CAL_EVENT': False, 'SECTION_DAV_XML_ID': None,
     'DATE_FROM_FORMATTED': 'Sun Sep 14 2025 19:00:00', 'DATE_TO_FORMATTED': 'Sun Sep 14 2025 20:30:00',
     'IS_DAYLIGHT_SAVING_TZ': 'N', 'SECT_ID': '27', 'OPTIONS': None, 'ATTENDEE_LIST': [], 'COLLAB_ID': None,
     '~DESCRIPTION': 'Услуга: Заклятие', '~USER_OFFSET_FROM': 0, '~USER_OFFSET_TO': 0, 'RESOURCE_BOOKING_ID': 65}],
    'time': {'start': 1757313039.333727, 'finish': 1757313039.37548, 'duration': 0.04175305366516113,
             'processing': 0.018873929977416992, 'date_start': '2025-09-08T09:30:39+03:00',
             'date_finish': '2025-09-08T09:30:39+03:00', 'operating_reset_at': 1757313639, 'operating': 0}}
