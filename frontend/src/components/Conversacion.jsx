import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import logo from '../assets/oc-ia.png'
import foto from '../assets/mi-foto.jpg'

function Conversacion() {
    // Función para manejar el cambio en el contenido del textarea
    const handleInputChange = (e) => {
        const textarea = e.target;
        textarea.style.height = "auto"; // Reseteamos la altura antes de recalcularla
        textarea.style.height = `${textarea.scrollHeight}px`; // Ajustamos la altura según el contenido
    };

    return (
        <main className="main">
            <div className="conversaciones">
                <div className="right">
                    <div className="chat-right">
                        <p>
                            Que hacer en ocasiones donde una persona pone excusas a la hora de
                            ofrecer servicios de call center
                        </p>
                    </div>
                    <div className="img">
                        <img src={foto} alt="" />
                    </div>
                </div>

                <div className="chat-left">
                    <div className="img">
                        <img src={logo} alt="" />
                    </div>
                    <p>
                        Manejar excusas durante la oferta de servicios en un call center requiere empatía, paciencia y técnicas efectivas de persuasión. Aquí tienes algunas estrategias:
                        <br /><br />
                        1. Escucha activa y empatía
                        Entiende la excusa: Permite que la persona explique su situación. Esto genera confianza y demuestra interés genuino.
                        Valida sus preocupaciones: Responde con frases como  &quot;Entiendo que esto pueda ser un inconveniente para usted.&quot;
                        <br /><br />
                        2. Identifica la objeción real
                        A menudo, las excusas son una manera de evitar rechazos directos. Intenta descubrir qué preocupa realmente al cliente, ya sea el precio, el tiempo o la utilidad del servicio.
                        Ejemplo: Si alguien dice &quot;Ahora no tengo tiempo&quot;, podrías responder:&quot;Entiendo, ¿cuándo sería un buen momento para discutir cómo este servicio puede ahorrarle tiempo a futuro?&quot;
                        <br /><br />
                        3. Ofrece soluciones personalizadas
                        Si la excusa es económica: Ofrece alternativas como descuentos o planes de pago.
                        Si es falta de tiempo: Resalta cómo el servicio puede facilitar su día a día.
                        <br /><br />
                        4. Resalta los beneficios clave
                        Utiliza frases que conecten emocionalmente, como:
                    </p>
                </div>
            </div>

            <div className="input-chat">
                <textarea
                    className='input-seart'
                    onInput={handleInputChange}
                    placeholder="Escribe tu mensaje..."
                >

                </textarea>
                <button>
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>
        </main>
    )
}
export default Conversacion