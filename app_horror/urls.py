from django.urls import path
from .views import *

urlpatterns = [
    path("horrors/", HorrorListView.as_view(), name="horror-list"),
    path("horrors/<int:horror_id>/", HorrorDetailView.as_view(), name="horror-detail"),
    path("horrors/<int:horror_id>/available-slots/", AvailableSlotsView.as_view(), name="available-slots"),
    path('bookings/', BookingCreateView.as_view(), name='create-booking'),
    path('slots/', SlotsListView.as_view(), name='slots-list'),
    path('give_data_mir_kvestov/<int:id_mir_kvestov>/',give_data_mir_kvestov),
    path('take_data_mir_kvestov/',take_data_mir_kvestov),
    path('take_bitrix_data/',take_bitrix_data),
    path('delete_bitrix_data/',delete_bitrix_data),
    path('create_bitrix_data/',сreate_bitrix_data),
    path('give_data_extrareality/<int:id_extrareality>/',give_data_extrareality),
    path('take_data_extrareality/',take_data_extrareality),

]