from datetime import datetime

data = {'result': [
    {'ID': '93', 'PARENT_ID': '93', 'ACTIVE': 'Y', 'DELETED': 'N', 'CAL_TYPE': 'resource', 'OWNER_ID': '0',
     'NAME': 'Бронирование: Тест', 'DATE_FROM': '11.09.2025 11:30:00', 'DATE_TO': '11.09.2025 13:00:00',
     'ORIGINAL_DATE_FROM': None, 'TZ_FROM': 'Europe/Moscow', 'TZ_TO': 'Europe/Moscow', 'TZ_OFFSET_FROM': '10800',
     'TZ_OFFSET_TO': '10800', 'DATE_FROM_TS_UTC': '1757568600', 'DATE_TO_TS_UTC': '1757574000', 'DT_SKIP_TIME': 'N',
     'DT_LENGTH': 5400, 'EVENT_TYPE': '#resourcebooking#', 'CREATED_BY': '1', 'DATE_CREATE': '09.09.2025 09:03:32',
     'TIMESTAMP_X': '09.09.2025 09:04:43', 'DESCRIPTION': 'Услуга: Зарождение зла', 'DT_FROM': None, 'DT_TO': None,
     'PRIVATE_EVENT': '', 'ACCESSIBILITY': 'busy', 'IMPORTANCE': 'normal', 'IS_MEETING': False, 'MEETING_STATUS': 'Y',
     'MEETING_HOST': '0', 'MEETING': None, 'LOCATION': '', 'REMIND': [], 'COLOR': '', 'TEXT_COLOR': '', 'RRULE': '',
     'EXDATE': '', 'DAV_XML_ID': '', 'G_EVENT_ID': '', 'DAV_EXCH_LABEL': '', 'CAL_DAV_LABEL': '', 'VERSION': '1',
     'ATTENDEES_CODES': None, 'RECURRENCE_ID': None, 'RELATIONS': '', 'SECTION_ID': '29', 'SYNC_STATUS': None,
     'UF_CRM_CAL_EVENT': False, 'UF_WEBDAV_CAL_EVENT': False, 'SECTION_DAV_XML_ID': None,
     'DATE_FROM_FORMATTED': 'Thu Sep 11 2025 11:30:00', 'DATE_TO_FORMATTED': 'Thu Sep 11 2025 13:00:00',
     'IS_DAYLIGHT_SAVING_TZ': 'N', 'SECT_ID': '29', 'OPTIONS': None, 'ATTENDEE_LIST': [], 'COLLAB_ID': None,
     '~DESCRIPTION': 'Услуга: Зарождение зла', '~USER_OFFSET_FROM': 0, '~USER_OFFSET_TO': 0,
     'RESOURCE_BOOKING_ID': 87}],
        'time': {'start': 1757397883.630108, 'finish': 1757397883.690699, 'duration': 0.06059098243713379,
                 'processing': 0.023556947708129883, 'date_start': '2025-09-09T09:04:43+03:00',
                 'date_finish': '2025-09-09T09:04:43+03:00', 'operating_reset_at': 1757398483, 'operating': 0}}


date_str = data['result'][0]['DATE_FROM'].split(' ')[0]
start_time_str = data['result'][0]['DATE_FROM'].split(' ')[1]
date_obj = datetime.strptime(date_str, '%d.%m.%Y')
start_time = datetime.strptime(start_time_str, "%H:%M:%S")
date = date_obj.strftime('%Y-%m-%d')
name = data['result'][0]['DESCRIPTION'].split(':')[1].replace(' ', '', 1)
print("id_result:", int(data['result'][0]['ID']))
print("booking_id:",data['result'][0]['RESOURCE_BOOKING_ID'])
print('date:', date)
print('start_time:', start_time)
print('name:', name)





