import requests
from datetime import datetime

webhook = "https://quest-house.bitrix24.by/rest/9/2ocnjfm34ikt3j43/"

resp = requests.get(
    webhook + "crm.deal.get.json",
    params={"id": '225'}
)
data = resp.json()
print('data: ', data)

resp = requests.get(
    webhook + "crm.deal.list.json",
    params={
        f"filter[UF_CRM_1756290475]": 95,
        "select": ["*", "UF_*"]
    }
)
data = resp.json()


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
