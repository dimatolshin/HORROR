import requests
from datetime import datetime

webhook = "https://quest-house.bitrix24.by/rest/9/2ocnjfm34ikt3j43/"

# Если UF_CRM_1756290524 - это кастомное поле для поиска
resp = requests.get(
    webhook + "crm.deal.list.json",
    params={
        "filter[UF_CRM_1756290524]": 89,
        "select": ["*", "UF_*"]
    }
)
data = resp.json()
print('data: ', data)

data = {'result': [
    {'ID': '219', 'TITLE': 'test', 'TYPE_ID': 'SALE', 'STAGE_ID': 'NEW', 'PROBABILITY': None, 'CURRENCY_ID': 'BYN',
     'OPPORTUNITY': '1000.00', 'IS_MANUAL_OPPORTUNITY': 'Y', 'TAX_VALUE': '0.00', 'LEAD_ID': None, 'COMPANY_ID': None,
     'CONTACT_ID': '5', 'QUOTE_ID': None, 'BEGINDATE': '2025-09-09T03:00:00+03:00',
     'CLOSEDATE': '2025-09-16T03:00:00+03:00', 'ASSIGNED_BY_ID': '1', 'CREATED_BY_ID': '1', 'MODIFY_BY_ID': '1',
     'DATE_CREATE': '2025-09-09T09:34:07+03:00', 'DATE_MODIFY': '2025-09-09T09:34:57+03:00', 'OPENED': 'Y',
     'CLOSED': 'N', 'COMMENTS': '[p]\nпвапывап\n[/p]', 'ADDITIONAL_INFO': None, 'LOCATION_ID': None, 'CATEGORY_ID': '0',
     'STAGE_SEMANTIC_ID': 'P', 'IS_NEW': 'Y', 'IS_RECURRING': 'N', 'IS_RETURN_CUSTOMER': 'N',
     'IS_REPEATED_APPROACH': 'N', 'SOURCE_ID': '', 'SOURCE_DESCRIPTION': None, 'ORIGINATOR_ID': None, 'ORIGIN_ID': None,
     'MOVED_BY_ID': '1', 'MOVED_TIME': '2025-09-09T09:34:07+03:00', 'LAST_ACTIVITY_TIME': '2025-09-09T09:34:07+03:00',
     'UTM_SOURCE': None, 'UTM_MEDIUM': None, 'UTM_CAMPAIGN': None, 'UTM_CONTENT': None, 'UTM_TERM': None,
     'LAST_COMMUNICATION_TIME': None, 'LAST_ACTIVITY_BY': '1'}], 'total': 1,
        'time': {'start': 1757403098.343457, 'finish': 1757403098.792498, 'duration': 0.44904112815856934,
                 'processing': 0.3821251392364502, 'date_start': '2025-09-09T10:31:38+03:00',
                 'date_finish': '2025-09-09T10:31:38+03:00', 'operating_reset_at': 1757403698,
                 'operating': 0.38210296630859375}}

# if "result" not in data:
#     raise Exception(f"Ошибка: {data}")

# booking_id = int(data["result"].get("UF_CRM_1756290486")[0])
# print('booking_id:', booking_id)
#
# respt = requests.get(
#     webhook + f"calendar.resource.booking.list/?filter[resourceIdList][]={booking_id}")
# print(respt.json())
# data = respt.json()
# print(data['result'][0]['ID'])
#
# respt1 = requests.get(
#     webhook + f"calendar.resource.booking.list/?filter[resourceIdList][]={booking_id}")
# print(respt.json())
# data = respt.json()
# date_str = data['result'][0]['DATE_FROM'].split(' ')[0]
# start_time_str = data['result'][0]['DATE_FROM'].split(' ')[1]
# date_obj = datetime.strptime(date_str, '%d.%m.%Y')
# start_time = datetime.strptime(start_time_str, "%H:%M:%S")
# date = date_obj.strftime('%Y-%m-%d')
# print('date:', date)
# print('start_time:', start_time)
