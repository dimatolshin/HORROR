from django.urls import path
from .views import HorrorListView, HorrorDetailView, AvailableSlotsView, BookingCreateView, SlotsListView

urlpatterns = [
    path("horrors/", HorrorListView.as_view(), name="horror-list"),
    path("horrors/<int:horror_id>/", HorrorDetailView.as_view(), name="horror-detail"),
    path("horrors/<int:horror_id>/available-slots/", AvailableSlotsView.as_view(), name="available-slots"),
    path('bookings/', BookingCreateView.as_view(), name='create-booking'),
    path('slots/', SlotsListView.as_view(), name='slots-list'),
]