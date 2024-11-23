import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from '../assets/oc-ia.png';
import foto from '../assets/mi-foto.jpg';
import { useState, useEffect, useRef } from 'react';

function Conversacion() {
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState([
        { sender: 'bot', text: '¡Hola! ¿En qué puedo ayudarte hoy?', animate: false }
    ]);

    const conversationEndRef = useRef(null);

    // Ajustar el scroll al final cada vez que cambie la conversación
    useEffect(() => {
        conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation]);

    // Función para añadir animación al nuevo mensaje
    const addMessageWithAnimation = (newMessage) => {
        setConversation((prevConversation) => [
            ...prevConversation,
            { ...newMessage, animate: true } // Agregar flag de animación
        ]);

        // Remover animación después de 3 segundos
        setTimeout(() => {
            setConversation((prevConversation) =>
                prevConversation.map((msg, index) =>
                    index === prevConversation.length ? { ...msg, animate: false } : msg
                )
            );
        }, 3000);
    };

    const handleInputChange = (e) => {
        const textarea = e.target;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
        setMessage(e.target.value);
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            addMessageWithAnimation({ sender: 'user', text: message });
            addMessageWithAnimation({ sender: 'bot', text: `Has escrito: "${message}"` });
            setMessage('');
            const textarea = document.querySelector('.input-seart');
            textarea.style.height = 'auto';
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <main className="main">
            <div className="conversaciones">
                {/* Mostrar la conversación */}
                {conversation.map((msg, index) => (
                    <div
                        key={index}
                        className={`${msg.sender === 'bot' ? 'chat-left' : 'right'} ${msg.animate ? 'message-animate' : ''
                            }`}
                    >   
                        {/* Si es del bot, imagen primero */}
                        {msg.sender === 'bot' ? (
                            <>
                                <div className="img">
                                    <img src={logo} alt="Bot" />
                                </div>
                                <div className="chat-left">
                                    <p>{msg.text}</p>
                                </div>
                            </>
                        ) : (
                            // Si es del usuario, mensaje primero, luego imagen
                            <>
                                <div className="chat-right">
                                    <p>{msg.text}</p>
                                </div>
                                <div className="img">
                                    <img src={foto} alt="Usuario" />
                                </div>
                            </>
                        )}
                    </div>
                ))}
                <div ref={conversationEndRef}></div>
            </div>

            <div className="input-chat">
                <textarea
                    className="input-seart"
                    value={message}
                    onInput={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe tu mensaje..."
                />
                <button onClick={handleSendMessage}>
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>
        </main>
    );
}

export default Conversacion;
