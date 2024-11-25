import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../assets/oc-ia.png';
import foto from '../assets/mi-foto.jpg';
import { useState } from 'react';

function Conversacion() {
    // Estado para almacenar el mensaje del usuario
    const [message, setMessage] = useState('');
    // Estado para almacenar la conversación
    const [conversation, setConversation] = useState([
        {
            sender: 'bot',
            text: '¡Hola! ¿En qué puedo ayudarte hoy?',
        },
    ]);
    // Estado para controlar el estado de carga mientras espera la respuesta del bot
    const [loading, setLoading] = useState(false);

    // Función para manejar el cambio en el contenido del textarea
    const handleInputChange = (e) => {
        const textarea = e.target;
        textarea.style.height = 'auto'; // Reseteamos la altura antes de recalcularla
        textarea.style.height = `${textarea.scrollHeight}px`; // Ajustamos la altura según el contenido
        setMessage(e.target.value); // Actualiza el mensaje que está escribiendo el usuario
    };

    // Función para manejar el envío del mensaje
    const handleSendMessage = async () => {
        if (message.trim()) {
            // Añadir el mensaje del usuario a la conversación
            setConversation([
                ...conversation,
                { sender: 'user', text: message },
            ]);

            // Restablecer el tamaño del textarea
            const textarea = document.querySelector('.input-seart');
            textarea.style.height = 'auto'; // Restablece la altura

            // Limpiar el input
            setMessage('');

            try {
                // Establecer estado de carga
                setLoading(true);

                // Hacer la solicitud al servidor Django
                const response = await fetch(
                    'http://127.0.0.1:8000/api/chat/',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ message }),
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    // Añadir la respuesta del bot a la conversación
                    setConversation((prevConversation) => [
                        ...prevConversation,
                        { sender: 'bot', text: data.reply },
                    ]);
                } else {
                    console.error(
                        'Error al comunicarse con el servidor:',
                        response.statusText
                    );
                    setConversation((prevConversation) => [
                        ...prevConversation,
                        {
                            sender: 'bot',
                            text: 'Lo siento, hubo un problema al procesar tu mensaje.',
                        },
                    ]);
                }
            } catch (error) {
                console.error('Error de conexión:', error);
                setConversation((prevConversation) => [
                    ...prevConversation,
                    {
                        sender: 'bot',
                        text: 'Lo siento, no puedo conectarme al servidor en este momento.',
                    },
                ]);
            } finally {
                // Quitar estado de carga
                setLoading(false);
            }
        }
    };

    // Función para manejar el evento de la tecla Enter
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevenimos el salto de línea al presionar Enter
            handleSendMessage(); // Enviamos el mensaje
        }
    };

    return (
        <main className='main'>
            <div className='conversaciones'>
                {/* Mostrar la conversación */}
                {conversation.map((msg, index) => (
                    <div
                        key={index}
                        className={msg.sender === 'bot' ? 'chat-left' : 'right'}
                    >
                        {/* Si es del bot, imagen primero */}
                        {msg.sender === 'bot' ? (
                            <>
                                <div className='img'>
                                    <img src={logo} alt='Bot' />
                                </div>
                                <div className='chat-left'>
                                    <p>{msg.text}</p>
                                </div>
                            </>
                        ) : (
                            // Si es del usuario, mensaje primero, luego imagen
                            <>
                                <div className='chat-right'>
                                    <p>{msg.text}</p>
                                </div>
                                <div className='img'>
                                    <img src={foto} alt='Usuario' />
                                </div>
                            </>
                        )}
                    </div>
                ))}
                {/* Mostrar un indicador de carga si el bot está procesando */}
                {loading && (
                    <div className='chat-left'>
                        <p>Escribiendo...</p>
                    </div>
                )}
            </div>

            <div className='input-chat'>
                <textarea
                    className='input-seart'
                    value={message} // Enlaza el valor con el estado
                    onInput={handleInputChange} // Ajusta la altura al escribir
                    onKeyDown={handleKeyDown} // Envía el mensaje al presionar Enter
                    placeholder='Escribe tu mensaje...'
                />
                <button onClick={handleSendMessage} disabled={loading}>
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>
        </main>
    );
}

export default Conversacion;
