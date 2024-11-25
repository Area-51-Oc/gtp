const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    try {
        const response = await axios.post('http://127.0.0.1:11434/api/chat', {
            model: 'llama3.2',
            messages: [
                { role: 'assistant', content: 'Eres un asistente experto.' },
                { role: 'user', content: userMessage },
            ],
            options: { temperature: 0.5 },
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).send('Error al conectar con Ollama');
    }
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
