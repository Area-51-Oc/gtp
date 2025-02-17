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

            # Definir el mensaje de sistema para establecer el rol del modelo
            system_prompt = {
                "role": "system",
                "content": "Eres un asistente virtual para un CallCenter de la campaña de Claro donde venden Terminales y tecnologia. Tu funcion es ayudarle a los asesores a resolver dudas en cuanto a gestion comercial y objeciones de los clientes"
            }

            # Configurar el prompt y el modelo
            modelo = 'llama3.2'

            # Llamar al modelo con el paquete `ollama`
            response = ollama.chat(model=modelo, messages=[
                system_prompt,  # Se establece el comportamiento del asistente
                {
                    'role': 'user',
                    'content': user_message
                }
            ])

            # Extraer y enviar la respuesta del modelo
            content = response.get('message', {}).get('content', 'No response')
            return JsonResponse({'reply': content})

        except Exception as e:
            # Manejar errores en el proceso
            return JsonResponse({'error': 'Error al procesar la solicitud', 'details': str(e)}, status=500)

    return JsonResponse({'error': 'Método no permitido'}, status=405)