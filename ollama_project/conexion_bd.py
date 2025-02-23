import pymysql
from pymysql.err import OperationalError, ProgrammingError

# Configuración de MySQL
MYSQL_HOST = "200.7.103.10"
MYSQL_USER = "consultasoc"
MYSQL_PASSWORD = "6fxm9H6tHd97%;jt87"
MYSQL_DATABASE = "ocmdb"
MYSQL_PORT = 3306  # Puerto por defecto, cámbialo si es diferente
FECHA = "2025-02-22"

print(f"Intentando conectar a MySQL en {MYSQL_HOST}:{MYSQL_PORT}...")
try:
    # Establecer conexión
    connection = pymysql.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DATABASE,
        port=MYSQL_PORT,
        connect_timeout=10  # Tiempo máximo de espera en segundos
    )
    
    print("¡Conexión exitosa a MySQL con pymysql!")
    print(f"Versión del servidor: {connection.server_version}")

    # Crear un cursor para ejecutar la consulta
    with connection.cursor() as cursor:
        # Consulta SQL
        query = """
        SELECT idlog_calls 
        FROM ocm_log_calls 
        WHERE DATE(fecha) >= %s
        limit 10
        """
        cursor.execute(query, (FECHA,))

        # Obtener resultados
        idcalls = [row[0] for row in cursor.fetchall()]
        print(f"Se encontraron {len(idcalls)} idcall para el {FECHA} o posterior: {idcalls}")

except OperationalError as e:
    print(f"Error operativo al conectar a MySQL: {e}")
    if "Can't connect" in str(e):
        print("No se puede conectar al servidor. Revisa el host, puerto o red.")
    elif "Access denied" in str(e):
        print("Acceso denegado. Revisa usuario y contraseña.")
except ProgrammingError as e:
    print(f"Error de programación (ej. base de datos o tabla no encontrada): {e}")
except Exception as e:
    print(f"Error inesperado: {e}")
finally:
    if 'connection' in locals() and connection.open:
        connection.close()
        print("Conexión a MySQL cerrada.")