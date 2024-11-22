import logo from '../assets/oc-ia.png'
import escudo from '../assets/escudo.png'
import mensaje from '../assets/mensaje.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import PropTypes from 'prop-types';

function Main({ handleConversacion }) {
    const [ocultarConsejos, setOcultarConsejos] = useState(false)

    const handleInputChange = (e) => {
        const textarea = e.target;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            handleConversacion();
        }
    };

    const handleOcultarConsejos = () => {
        setOcultarConsejos(true)
    }

    return (
        <main className='main'>
            <div className="logotipo">
                <div className="img">
                    <img src={logo} alt="" />
                </div>
                <p>OC AI Chat</p>
            </div>

            {!ocultarConsejos ? 
                <>
                    <div className="consejos">
                        <div className="consejo">
                            <img src={escudo} alt="" />
                            <p>
                                Tus chats son privados y
                                nunca se guardan ni se usan
                                para entrenar modelos de IA
                            </p>
                        </div>
                        <div className="consejo">
                            <img src={mensaje} alt="" />
                            <p>
                                Ayudanos con tus comentarios
                                para mejorar las respuestas
                                de la IA
                            </p>
                        </div>
                    </div>
                    <p className="ocultar-consejos" onClick={handleOcultarConsejos}>Ocultar consejos</p>
                </>
                :
                <h1 className='ayuda'>¿Con qué puedo ayudarte?</h1>
            }

            <div className="input-chat">
                <textarea
                    className='input-seart'
                    onInput={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe tu mensaje..."
                />
                <button onClick={() => handleConversacion()}>
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>
        </main>
    )
}

Main.propTypes = {
    handleConversacion: PropTypes.func.isRequired,
};

export default Main