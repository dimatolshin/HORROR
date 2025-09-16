from adrf.fields import SerializerMethodField
from adrf.serializers import ModelSerializer, Serializer
from rest_framework import serializers
from app_horror.models import Horror, TimeSlot, Booking, Photo, BackgroundPhotoCard, BlurPhoto


class PhotoSerializer(ModelSerializer):
    """Сериализатор для фотографий"""
    class Meta:
        model = Photo
        fields = ["image"]


class BackgroundPhotoCardSerializer(ModelSerializer):
    """Сериализатор для фотографий фона"""
    class Meta:
        model = BackgroundPhotoCard
        fields = ["image"]


class BlurPhotoSerializer(ModelSerializer):
    """Сериализатор для фотографий блюра"""
    class Meta:
        model = BlurPhoto
        fields = ["image"]


class HorrorSerializer(ModelSerializer):
    """Сериализатор для модели Horror с фотографиями"""
    photos = SerializerMethodField()
    photos_back_card = SerializerMethodField()
    photos_blur = SerializerMethodField()

    class Meta:
        model = Horror
        fields = "__all__"

    def get_photos(self, obj):
        """Метод для получения всех фотографий, связанных с Horror"""
        photos = obj.photos.all()  # Получаем все фотографии
        return PhotoSerializer(photos, many=True).data  # Сериализуем фотографии

    def get_photos_back_card(self, obj):
        """Метод для получения всех фотографий фона, связанных с Horror"""
        background_photos = obj.photos_back_card.all()  # Получаем все фотографии фона
        return BackgroundPhotoCardSerializer(background_photos, many=True).data  # Сериализуем фотографии фона

    def get_photos_blur(self, obj):
        """Метод для получения всех фотографий блюра, связанных с Horror"""
        blur_photos = obj.photos_blur.all()  # Получаем все фотографии блюра
        return BlurPhotoSerializer(blur_photos, many=True).data  # Сериализуем фотографии блюра


class BookingSerializer(serializers.ModelSerializer):
    slot = serializers.PrimaryKeyRelatedField(
        queryset=TimeSlot.objects.all(),
        required=False,
        allow_null=True,
        default=None
    )

    class Meta:
        model = Booking
        fields = "__all__"


class TimeSlotSerializer(ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = "__all__"


