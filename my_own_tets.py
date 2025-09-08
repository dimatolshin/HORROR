import requests

webhook = "https://quest-house.bitrix24.by/rest/9/2ocnjfm34ikt3j43/"

resp = requests.get(
    webhook + "crm.deal.get.json",
    params={"id": '213'}
)
data = resp.json()
print('data: ', data)

if "result" not in data:
    raise Exception(f"Ошибка: {data}")

booking_id = int(data["result"].get("UF_CRM_1756290486")[0])
print('booking_id:', booking_id)

respt = requests.get(
    webhook + f"calendar.resource.booking.list/?filter[resourceIdList][]={booking_id}")
print(respt.json())
data = respt.json()
print(data['result'][0]['ID'])

