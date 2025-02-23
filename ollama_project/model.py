import os
import ollama

# Configuración
TRANSCRIPTIONS_FOLDER = "transcripciones"
CONTEXT_FOLDER = "contexto"  # Opcional
OUTPUT_FOLDER = "output_llm"  # Nueva carpeta para las respuestas de LLaMA
MODEL_NAME = "llama3.2"

# Verificar que la carpeta de transcripciones exista
if not os.path.exists(TRANSCRIPTIONS_FOLDER):
    print(f"Error: La carpeta '{TRANSCRIPTIONS_FOLDER}' no se encuentra.")
    exit()

# Crear la carpeta output_llm si no existe
if not os.path.exists(OUTPUT_FOLDER):
    os.makedirs(OUTPUT_FOLDER)
    print(f"Carpeta '{OUTPUT_FOLDER}' creada.")

# Obtener lista de archivos .txt en la carpeta de transcripciones
txt_files = [f for f in os.listdir(TRANSCRIPTIONS_FOLDER) if f.endswith(".txt")]
if not txt_files:
    print(f"No se encontraron archivos .txt en '{TRANSCRIPTIONS_FOLDER}'.")
    exit()

print(f"Se encontraron {len(txt_files)} transcripciones en '{TRANSCRIPTIONS_FOLDER}': {txt_files}")

# Cargar contexto (opcional)
context_content = ""
if os.path.exists(CONTEXT_FOLDER):
    context_files = [f for f in os.listdir(CONTEXT_FOLDER) if f.endswith(".txt")]
    for context_file in context_files:
        file_path = os.path.join(CONTEXT_FOLDER, context_file)
        with open(file_path, "r", encoding="utf-8") as file:
            context_content += f"\n--- Contenido de {context_file} ---\n{file.read().strip()}\n"
    print("\nContexto cargado para RAG:")
    print(context_content[:500] + "..." if len(context_content) > 500 else context_content)

# Prompt ajustado con énfasis en políticas
SYSTEM_PROMPT = """
{context}
Actúa como un auditor experto en calidad de llamadas para Claro, especializado en evaluar interacciones de asesores que venden productos y servicios (terminales, tecnología, portabilidad, hogar). Analiza cada transcripción y enfócate en:

1. **Lectura de políticas**: Determina si el asesor hizo referencia a las políticas de **Habeas Data** y **Ley 2300**. No es necesario citarlas textualmente, pero debe mencionar conceptos como autorización para tratar datos personales (Habeas Data) o permiso para contacto futuro (Ley 2300). Ejemplos:
   - Habeas Data: "Autoriza a Claro a consultar su información" o "Tratamiento de datos según la ley".
   - Ley 2300: "Me autoriza contactarlo por WhatsApp o llamada si se corta".

2. **Análisis comercial**:
   - **Comunicación**: Evalúa claridad, tono, empatía y lenguaje.
   - **Conocimiento**: Verifica dominio del producto/servicio y argumentos de venta.
   - **Proceso de venta**: Analiza estructura, gestión y manejo de necesidades.

3. **Retroalimentación**: Ofrece observaciones específicas, buenas prácticas y recomendaciones accionables.

Formato de salida:
- **Lectura de políticas**:
  - Habeas Data: [Sí/No, con evidencia o "Sin evidencia"]
  - Ley 2300: [Sí/No, con evidencia o "Sin evidencia"]
- **Resumen**: [2-3 oraciones]
- **Propósito principal**: [Propósito]
- **Análisis comercial**: [Evaluación breve de comunicación, conocimiento, proceso]
- **Retroalimentación**: [Fortalezas, áreas de mejora, recomendaciones]

Usa un tono profesional y basa tu análisis en la transcripción y el contexto (si aplica).
"""

# Procesar cada transcripción
for txt_file in txt_files:
    file_path = os.path.join(TRANSCRIPTIONS_FOLDER, txt_file)
    print(f"\nProcesando archivo: {file_path}...")

    try:
        with open(file_path, "r", encoding="utf-8") as file:
            transcript = file.read().strip()
        
        if not transcript:
            print(f"El archivo '{file_path}' está vacío.")
            continue
        
        print("Transcripción enviada a LLaMA 3.2:")
        print(transcript)

        # Preparar el prompt con contexto (si existe)
        full_system_prompt = SYSTEM_PROMPT.format(context=context_content if context_content else "Sin contexto adicional.")
        messages = [
            {"role": "system", "content": full_system_prompt},
            {"role": "user", "content": f"Analiza esta transcripción:\n{transcript}"}
        ]

        # Enviar a LLaMA 3.2
        response = ollama.chat(model=MODEL_NAME, messages=messages)
        model_output = response["message"]["content"]
        print("Respuesta de LLaMA 3.2:")
        print(model_output)

        # Guardar la respuesta en la carpeta output_llm
        output_file = os.path.join(OUTPUT_FOLDER, f"resumen_{txt_file}")
        with open(output_file, "w", encoding="utf-8") as file:
            file.write(model_output)
        print(f"Resumen guardado en: {output_file}")

    except Exception as e:
        print(f"Error al procesar '{file_path}': {e}")

print("\n¡Proceso completo!")