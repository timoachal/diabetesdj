from django.urls import path
from . import views

app_name = 'predictor'

urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('services/', views.services, name='services'),
    path('predict/', views.prediction_form, name='prediction_form'),
    path('api/predict/', views.predict_diabetes, name='predict_diabetes'),
    path('history/', views.prediction_history, name='history'),
]

