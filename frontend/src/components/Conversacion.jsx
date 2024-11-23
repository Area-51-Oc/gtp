import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import logo from '../assets/oc-ia.png'
import foto from '../assets/mi-foto.jpg'
import { useState } from 'react'

function Conversacion() {
    // Estado para almacenar el mensaje del usuario
    const [message, setMessage] = useState('');
    // Estado para almacenar la conversación
    const [conversation, setConversation] = useState([
        {
            sender: 'bot',
            text: '¡Hola! ¿En qué puedo ayudarte hoy?'
        }
    ]);

    // Función para manejar el cambio en el contenido del textarea
    const handleInputChange = (e) => {
        const textarea = e.target;
        textarea.style.height = "auto"; // Reseteamos la altura antes de recalcularla
        textarea.style.height = `${textarea.scrollHeight}px`; // Ajustamos la altura según el contenido
        setMessage(e.target.value); // Actualiza el mensaje que está escribiendo el usuario
    };

    // Función para manejar el envío del mensaje
    const handleSendMessage = () => {
        if (message.trim()) {
            // Añadir el mensaje del usuario a la conversación
            setConversation([...conversation, { sender: 'user', text: message }]);

            // Respuesta del "bot" (puedes reemplazar esto con lógica más compleja)
            setConversation(prevConversation => [
                ...prevConversation,
                { sender: 'bot', text: `Has escrito: "${message}"` }
            ]);

            // Limpiar el input
            setMessage('');

            // Restablecer el tamaño del textarea
            const textarea = document.querySelector('.input-seart');
            textarea.style.height = 'auto'; // Restablece la altura
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
        <main className="main">
            <div className="conversaciones">
                {/* Mostrar la conversación */}
                {conversation.map((msg, index) => (
                    <div key={index} className={msg.sender === 'bot' ? 'chat-left' : 'right'}>
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
            </div>

            <div className="input-chat">
                <textarea
                    className="input-seart"
                    value={message} // Enlaza el valor con el estado
                    onInput={handleInputChange} // Ajusta la altura al escribir
                    onKeyDown={handleKeyDown} // Envía el mensaje al presionar Enter
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
