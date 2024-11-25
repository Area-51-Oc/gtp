const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

const MAX_RETRIES = 3; // Número máximo de reintentos
const RETRY_DELAY = 5000; // Retraso entre reintentos (en ms)


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Función para manejar solicitudes a Ollama con reintentos
const fetchOllamaResponse = async (payload, retries = MAX_RETRIES) => {
    try {
        const response = await axios.post(
            'http://localhost:11434/api/chat',
            payload,
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 60000, // 60 segundos de espera por respuesta
            }
        );
        return response.data;
    } catch (error) {
        if (retries > 0) {
            console.warn(
                `Reintento restante: ${retries}, esperando ${RETRY_DELAY}ms`
            );
            await delay(RETRY_DELAY); // Esperar antes de reintentar
            return fetchOllamaResponse(payload, retries - 1); // Reintentar
        }
        throw error; // Agotar reintentos y lanzar el error
    }
};

// Ruta para interactuar con Ollama
app.post('/chat03', async (req, res) => {
    try {
        const userMessage = req.body.message;

        if (!userMessage) {
            return res
                .status(400)
                .json({ error: 'El campo "message" es obligatorio' });
        }

        // Crear el payload para la solicitud a Ollama
        const payload = {
            model: 'llama3.2',
            messages: [{ role: 'user', content: userMessage }],
        };

        // Realizar la solicitud a Ollama
        const response = await fetchOllamaResponse(payload);

        // Validar la respuesta
        if (!response || !response.message || !response.message.content) {
            return res
                .status(500)
                .json({ error: 'Ollama no devolvió una respuesta válida' });
        }

        // Enviar la respuesta al cliente
        res.json({ reply: response.message.content });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error.message);
        res.status(500).json({
            error: 'Error interno al procesar la solicitud',
            details: error.message,
        });
    }
});

app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;

        // Validar entrada del usuario
        if (!userMessage) {
            return res
                .status(400)
                .json({ error: 'El campo "message" es obligatorio' });
        }

        console.log('Mensaje del usuario:', userMessage);

        // Crear el payload (cuerpo de la solicitud)
        const payload = {
            model: 'llama3.2', // Definir el modelo que tenemos corriendo
            messages: [
                {
                    role: 'assistant',
                },
                {
                    role: 'user',
                    content: userMessage, // Mensaje dinámico proporcionado por el usuario
                },
            ],
            format: 'json', // Formato de la respuesta
            stream: false, // Para que el mensaje no salga en partes
            options: {
                temperature: 1, // Reducir creatividad para respuestas más coherentes
            },
        };

        // Enviar la solicitud a Ollama con manejo de reintentos
        const ollamaResponse = await fetchOllamaResponse(payload);

        // Validar contenido de la respuesta
        const generatedMessage = ollamaResponse?.message?.content;
        if (!generatedMessage || generatedMessage.trim() === '') {
            return res.status(500).json({
                error: 'El modelo no generó contenido válido.',
                details: ollamaResponse,
            });
        }

        // Enviar la respuesta al cliente
        res.json({ response: generatedMessage });
    } catch (err) {
        // Manejo de errores
        console.error('Error al procesar la solicitud:', err.message);
        if (err.response) {
            res.status(err.response.status).json({
                error: 'Error en la respuesta del servidor de Ollama',
                details: err.response.data,
            });
        } else if (err.request) {
            res.status(500).json({
                error: 'No se recibió respuesta del servidor de Ollama',
                details: err.request,
            });
        } else {
            res.status(500).json({
                error: 'Error interno al procesar la solicitud',
                details: err.message,
            });
        }
    }
});

app.post('/chat02', async (req, res) => {
    try {
        const userMessage = req.body.message;

        console.log('Mensaje del usuario:', userMessage);

        const response = await axios.post('http://127.0.0.1:11434/api/chat', {
            message: userMessage,
            model: 'llama3.2',
        });

        res.json({ response: response.data }); // Accede a los datos de la respuesta
    } catch (error) {
        if (error.response) {
            console.error(
                'Error en la respuesta del servidor:',
                error.response.status,
                error.response.data
            );
        } else if (error.request) {
            console.error('No se recibió respuesta:', error.request);
        } else {
            console.error(
                'Error en la configuración de la solicitud:',
                error.message
            );
        }
        res.status(500).json({
            error: 'Error al procesar la solicitud',
            details: error.message,
        });
    }
});



// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});
