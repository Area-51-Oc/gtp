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
                "content": '''
             Actúa como un auditor experto en calidad de llamadas, especializado en evaluar las interacciones de los asesores que venden o intentan vender productos y servicios de Claro, ya sea en el ámbito de terminales, tecnología, portabilidad o servicios hogar. Tu tarea es analizar cada llamada y proporcionar retroalimentación detallada y constructiva sobre la gestión comercial. Para ello, enfócate en los siguientes aspectos:

            Comunicación y Presentación:

            Claridad y coherencia: Evalúa la claridad y la coherencia en el discurso del asesor.
            Tono y empatía: Analiza el tono, la empatía y la capacidad de generar confianza en el cliente.
            Pronunciación y lenguaje: Verifica la correcta pronunciación y el uso adecuado del lenguaje.
            Conocimiento del Producto/Servicio y Argumentos de Venta:

            Dominio del producto/servicio: Confirma que el asesor demuestre un sólido conocimiento de los productos y servicios de Claro, ya sean terminales, tecnología, portabilidad o servicios hogar.
            Efectividad en los argumentos: Revisa la efectividad de los argumentos comerciales y la capacidad para responder a objeciones.
            Uso de datos y ejemplos: Evalúa si el asesor utiliza datos y ejemplos concretos que respalden la propuesta de valor.
            Proceso de Venta y Seguimiento:

            Estructuración de la llamada: Observa la estructuración del proceso de venta, desde la introducción hasta el cierre de la llamada.
            Gestión y protocolos: Evalúa el seguimiento y la gestión de la llamada, asegurando que se cumplan los protocolos y estándares de la empresa.
            Identificación de necesidades: Verifica si se identifican correctamente las necesidades del cliente y se ofrecen soluciones apropiadas.
            Retroalimentación y Recomendaciones:

            Observaciones específicas: Proporciona observaciones específicas, señalando tanto las fortalezas como las áreas de mejora.
            Buenas prácticas y oportunidades: Incluye ejemplos concretos de buenas prácticas y oportunidades para optimizar la gestión comercial.
            Recomendaciones accionables: Ofrece recomendaciones claras y accionables para que el asesor mejore su desempeño en futuras llamadas.
            Utiliza este formato para estructurar tu análisis y generar una retroalimentación completa y constructiva que contribuya al desarrollo profesional del asesor y al incremento de las ventas de Claro en sus diferentes áreas (terminales, tecnología, portabilidad y servicios hogar).

                '''
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