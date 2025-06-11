"""
URL configuration for dogs project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.http import HttpResponseForbidden
from django.shortcuts import render
from django.urls import path, include
from django.views.generic import TemplateView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from django.conf import settings
from django.conf.urls.static import static


def internal_only(view):
    """Декоратор, чтобы ограничить доступ только для localhost"""

    def wrapper(request, *args, **kwargs):
        allowed_ips = ["127.0.0.1", "localhost"]
        client_ip = request.META.get("REMOTE_ADDR", "")
        if client_ip not in allowed_ips:
            return HttpResponseForbidden("Доступ запрещён")
        return view(request, *args, **kwargs)
    return wrapper


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/redoc/', internal_only(SpectacularRedocView.as_view(url_name='schema'))),
    path('api/', include('app_core.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
