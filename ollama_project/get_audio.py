import requests
import json
import os
import pymysql
from pymysql.err import OperationalError, ProgrammingError

# Configuración de la API
HOST = "https://winocportabilidad.ocmsoft.net:8080"
APITOKEN = "0CUr4B4Tok3n"
USER = "1000654149"
PASSWORD = "1000654149"

# Configuración de MySQL
MYSQL_HOST = "200.7.103.10"
MYSQL_USER = "consultasoc"
MYSQL_PASSWORD = "6fxm9H6tHd97%;jt87"
MYSQL_DATABASE = "ocmdb"
MYSQL_PORT = 3306
FECHA = "2025-02-22"  # Ajusta la fecha que quieras

# Paso 1: Obtener el token JWT
auth_headers = {"ApiToken": APITOKEN, "Content-Type": "application/json"}
auth_data = {"user": USER, "password": PASSWORD}

print("Obteniendo token JWT...")
try:
    auth_response = requests.post(f"{HOST}/OCMAPI/Authorization", headers=auth_headers, data=json.dumps(auth_data))
    auth_response.raise_for_status()
    token_jwt = auth_response.json().get("data", {}).get("token")
    if not token_jwt:
        print("Error: No se encontró el token.")
        exit()
    print(f"Token JWT obtenido: {token_jwt}")
except requests.exceptions.RequestException as e:
    print(f"Error al obtener el token: {e}")
    exit()

# Paso 2: Conectar a MySQL y obtener los idcall
print(f"\nConectando a MySQL y consultando idcall para el {FECHA}...")
try:
    connection = pymysql.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DATABASE,
        port=MYSQL_PORT,
        connect_timeout=10
    )
    print("¡Conexión exitosa a MySQL con pymysql!")

    with connection.cursor() as cursor:
        query = """
        SELECT idlog_calls 
        FROM ocm_log_calls 
        WHERE typecall = 'Transfer' and typeskill = 'SKILL' 
        and fecha >= %s
        limit 50
        """
        cursor.execute(query, (FECHA,))
        idcalls = [row[0] for row in cursor.fetchall()]
        print(f"Se encontraron {len(idcalls)} idcall para el {FECHA} o posterior: {idcalls}")

except OperationalError as e:
    print(f"Error al conectar a MySQL: {e}")
    exit()
except ProgrammingError as e:
    print(f"Error en la consulta SQL: {e}")
    exit()
finally:
    if 'connection' in locals() and connection.open:
        connection.close()
        print("Conexión a MySQL cerrada.")

# Paso 3: Iterar sobre los idcall y descargar grabaciones
audio_headers = {"Authorization": f"Bearer {token_jwt}", "Content-Type": "application/json"}
audio_folder = "Audio"

# Crear la carpeta Audio si no existe
if not os.path.exists(audio_folder):
    os.makedirs(audio_folder)
    print(f"Carpeta '{audio_folder}' creada.")

for idcall in idcalls:
    print(f"\nProcesando idcall: {idcall}")
    
    # Obtener grabaciones con GetRecording
    recording_data = {"idcall": str(idcall)}
    try:
        recording_response = requests.post(
            f"{HOST}/OCMAPI/V2/GetRecording",
            headers=audio_headers,
            data=json.dumps(recording_data)
        )
        recording_response.raise_for_status()
        recordings = recording_response.json()

        if recordings and isinstance(recordings, list) and len(recordings) > 0:
            # Tomar la primera grabación
            audiotoken = recordings[0]["token"]
            print(f"Grabación encontrada: idcall={idcall}, audiotoken={audiotoken}")

            # Descargar con GetAudio
            audio_data = {"idcall": str(idcall), "audiotoken": str(audiotoken)}
            audio_response = requests.post(
                f"{HOST}/OCMAPI/V2/GetAudio",
                headers=audio_headers,
                data=json.dumps(audio_data)
            )
            audio_response.raise_for_status()

            content_type = audio_response.headers.get("Content-Type", "Desconocido")
            print(f"Tipo de contenido: {content_type}")

            if "audio/wav" in content_type.lower() or "audio/wave" in content_type.lower():
                filename = os.path.join(audio_folder, f"{idcall}.wav")
                with open(filename, "wb") as archivo:
                    archivo.write(audio_response.content)
                print(f"Grabación guardada como '{filename}'.")
            else:
                print(f"Error: No se devolvió WAV para idcall {idcall}. Respuesta: {audio_response.text}")
        else:
            print(f"No se encontraron grabaciones para idcall {idcall}.")

    except requests.exceptions.RequestException as e:
        print(f"Error al procesar idcall {idcall}: {e}")

print("\n¡Proceso completo!")