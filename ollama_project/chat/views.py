import ollama  # Asegúrate de que el paquete esté instalado
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def chat_with_ollama(request):
    if request.method == 'POST':
        try:
            # Obtener el mensaje del usuario desde el cuerpo de la solicitud
            body = json.loads(request.body)
            user_message = body.get('message', None)

            if not user_message:
                return JsonResponse({'error': 'El campo "message" es obligatorio'}, status=400)

            # Configurar el prompt y el modelo
            prompt = user_message
            modelo = 'llama3.2'

            # Llamar al modelo con el paquete `ollama`
            response = ollama.chat(model=modelo, messages=[
                {
                    'role': 'user',
                    'content': prompt
                }
            ])

            # Extraer y enviar la respuesta del modelo
            content = response.get('message', {}).get('content', 'No response')
            return JsonResponse({'reply': content})

        except Exception as e:
            # Manejar errores en el proceso
            return JsonResponse({'error': 'Error al procesar la solicitud', 'details': str(e)}, status=500)

    return JsonResponse({'error': 'Método no permitido'}, status=405)
