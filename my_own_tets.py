import requests
from datetime import datetime

BITRIX24_WEBHOOK = "https://quest-house.bitrix24.by/rest/9/2ocnjfm34ikt3j43/"

resp = requests.get(
        BITRIX24_WEBHOOK + "crm.deal.list.json",
        params={
            "filter[UF_CRM_1756290524]": 99,
            "select": ["*", "UF_*"]
        }
    )
data = resp.json()
price = data['result']
# client_id = int(data['result'][0]['CONTACT_ID'])
# comment = int(data['result'][0]['COMMENTS'])

