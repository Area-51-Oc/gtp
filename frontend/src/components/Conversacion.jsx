import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../assets/oc-ia.png';
import foto from '../assets/mi-foto.jpg';
import { useState, useEffect, useRef } from 'react';

function Conversacion() {
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState([
        {
            sender: 'bot',
            text: '¡Hola! ¿En qué puedo ayudarte hoy?',
            animate: false,
        },
    ]);
    const [loading, setLoading] = useState(false);
    const conversationEndRef = useRef(null);

    // Ajustar el scroll al final cada vez que cambie la conversación
    useEffect(() => {
        conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation]);

    // Función para manejar el cambio de contenido en el textarea
    const handleInputChange = (e) => {
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
        setMessage(e.target.value);
    };

    // Función para enviar el mensaje del usuario y consultar la API
    const handleSendMessage = async () => {
        if (message.trim()) {
            // Añadir el mensaje del usuario a la conversación
            setConversation((prevConversation) => [
                ...prevConversation,
                { sender: 'user', text: message },
            ]);

            setMessage('');
            const textarea = document.querySelector('.input-seart');
            textarea.style.height = 'auto';

            // Mostrar "Escribiendo..." mientras se procesa
            setConversation((prevConversation) => [
                ...prevConversation,
                { sender: 'bot', text: 'Escribiendo...', animate: true },
            ]);

            // Llamada a la API
            try {
                setLoading(true);
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
                    // Reemplazar "Escribiendo..." con la respuesta del bot
                    setConversation((prevConversation) => [
                        ...prevConversation.slice(0, -1), // Eliminar el último mensaje ("Escribiendo...")
                        { sender: 'bot', text: data.reply, animate: true },
                    ]);
                } else {
                    console.error(
                        'Error al comunicarse con el servidor:',
                        response.statusText
                    );
                    setConversation((prevConversation) => [
                        ...prevConversation.slice(0, -1), // Eliminar el último mensaje ("Escribiendo...")
                        {
                            sender: 'bot',
                            text: 'Lo siento, hubo un problema al procesar tu mensaje.',
                        },
                    ]);
                }
            } catch (error) {
                console.error('Error de conexión:', error);
                setConversation((prevConversation) => [
                    ...prevConversation.slice(0, -1), // Eliminar el último mensaje ("Escribiendo...")
                    {
                        sender: 'bot',
                        text: 'Lo siento, no puedo conectarme al servidor en este momento.',
                    },
                ]);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <main className='main'>
            <div className='conversaciones'>
                {/* Mostrar la conversación */}
                {conversation.map((msg, index) => (
                    <div
                        key={index}
                        className={`${
                            msg.sender === 'bot' ? 'chat-left' : 'right'
                        } ${msg.animate ? 'message-animate' : ''}`}
                    >
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
                <div ref={conversationEndRef}></div>
            </div>

            <div className='input-chat'>
                <textarea
                    className='input-seart'
                    value={message}
                    onInput={handleInputChange}
                    onKeyDown={handleKeyDown}
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