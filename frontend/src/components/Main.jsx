import logo from '../assets/oc-ia.png';
import escudo from '../assets/escudo.png';
import mensaje from '../assets/mensaje.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import PropTypes from 'prop-types';

function Main({ handleConversacion }) {
    const [message, setMessage] = useState('');
    const [ocultarConsejos, setOcultarConsejos] = useState(false);

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSend = () => {
        if (message.trim()) {
            handleConversacion(message); // Envía el mensaje al componente App
            setMessage(''); // Limpia el textarea
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    };

    const handleOcultarConsejos = () => {
        setOcultarConsejos(true);
    };

    return (
        <main className='main'>
            <div className="logotipo">
                <div className="img">
                    <img src={logo} alt="" />
                </div>
                <p>OC AI Chat</p>
            </div>

            {!ocultarConsejos ? (
                <>
                    <div className="consejos">
                        <div className="consejo">
                            <img src={escudo} alt="" />
                            <p>
                                Tus chats son privados y nunca se guardan ni se usan para entrenar modelos de IA
                            </p>
                        </div>
                        <div className="consejo">
                            <img src={mensaje} alt="" />
                            <p>
                                Ayudanos con tus comentarios para mejorar las respuestas de la IA
                            </p>
                        </div>
                    </div>
                    <p className="ocultar-consejos" onClick={handleOcultarConsejos}>
                        Ocultar consejos
                    </p>
                </>
            ) : (
                <h1 className='ayuda'>¿Con qué puedo ayudarte?</h1>
            )}

            <div className="input-chat">
                <textarea
                    className='input-seart'
                    value={message}
                    onInput={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe tu mensaje..."
                />
                <button onClick={handleSend}>
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>
        </main>
    );
}

Main.propTypes = {
    handleConversacion: PropTypes.func.isRequired,
};

export default Main;
