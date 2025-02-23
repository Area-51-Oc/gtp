from deepgram import DeepgramClient, PrerecordedOptions
import os

# Configuración de Deepgram
DEEPGRAM_API_KEY = "0cc3334e81eb81c691705c94073b57bf6ac5982d"
AUDIO_FILE_PATH = "Audio/399156003.wav"  # Ruta al archivo WAV
TRANSCRIPTIONS_FOLDER = "transcripciones"  # Nombre de la carpeta de transcripciones
OUTPUT_TEXT_FILE = os.path.join(TRANSCRIPTIONS_FOLDER, "transcripcion_399155193.txt")  # Ruta completa del archivo de salida

# Verificar que el archivo WAV exista
if not os.path.exists(AUDIO_FILE_PATH):
    print(f"Error: El archivo {AUDIO_FILE_PATH} no se encuentra.")
    exit()

print(f"Procesando el archivo: {AUDIO_FILE_PATH}...")

# Crear la carpeta transcripciones si no existe
if not os.path.exists(TRANSCRIPTIONS_FOLDER):
    os.makedirs(TRANSCRIPTIONS_FOLDER)
    print(f"Carpeta '{TRANSCRIPTIONS_FOLDER}' creada.")

# Paso 1: Inicializar el cliente de Deepgram
try:
    deepgram = DeepgramClient(DEEPGRAM_API_KEY)

    # Paso 2: Leer el archivo WAV
    with open(AUDIO_FILE_PATH, "rb") as audio_file:
        buffer_data = audio_file.read()

    # Paso 3: Configurar opciones de transcripción
    options = PrerecordedOptions(
        model="nova-2",  # Modelo de transcripción
        language="es",   # Idioma (español)
        punctuate=True,  # Añadir puntuación
        diarize=True     # Identificar diferentes hablantes
    )

    # Paso 4: Enviar el audio a Deepgram usando la nueva API REST
    response = deepgram.listen.rest.v("1").transcribe_file(
        {"buffer": buffer_data, "mimetype": "audio/wav"},
        options
    )

    # Paso 5: Extraer la transcripción
    transcript = response["results"]["channels"][0]["alternatives"][0]["transcript"]
    if not transcript:
        print("No se detectó transcripción en el audio.")
    else:
        print("Transcripción obtenida:")
        print(transcript)

        # Guardar la transcripción en la carpeta transcripciones
        with open(OUTPUT_TEXT_FILE, "w", encoding="utf-8") as text_file:
            text_file.write(transcript)
        print(f"Transcripción guardada en: {OUTPUT_TEXT_FILE}")

except Exception as e:
    print(f"Error al procesar con Deepgram: {e}")

print("\n¡Proceso completo!")