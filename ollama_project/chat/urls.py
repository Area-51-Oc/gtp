from django.urls import path
from .views import chat_with_ollama

urlpatterns = [
    path('', chat_with_ollama, name='chat_with_ollama'),  # Endpoint para el chat
]
