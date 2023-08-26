from django.urls import path
from .views import RecommendationView

urlpatterns = [
    path('api/recommendations/', RecommendationView.as_view(), name='recommendations'),
]


