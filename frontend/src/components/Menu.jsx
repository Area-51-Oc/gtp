import { useState } from 'react';
import viewchat from '../assets/chats.png';
import newChat from '../assets/new-chat.png';
import PropTypes from 'prop-types';

function Menu({ handleNewChat }) {
    const [isMenuCollapsed, setIsMenuCollapsed] = useState(false); // Controla si el menú está colapsado

    return (
        <aside className={`menu ${isMenuCollapsed ? 'collapsed' : ''}`}>
            {/* Botones principales siempre visibles */}
            <div className="acciones">
                <button onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}>
                    <img src={viewchat} alt="Ver chats existentes" />
                </button>
                <button onClick={() => handleNewChat()}>
                    <img src={newChat} alt="Iniciar nuevo chat" />
                </button>
            </div>

            {/* Contenido del menú visible solo si no está colapsado */}
            {!isMenuCollapsed && (
                <>
                    <h3>
                        OC AI Chat <span className="beta">Beta</span>
                    </h3>
                    <div className="chats">
                        <p>No hay chats disponibles</p>
                    </div>
                    <div className="botones">
                        <button>Compartir comentarios</button>
                        <button>Más información</button>
                        <button>Página de ayuda</button>
                    </div>
                </>
            )}
        </aside>
    );
}

Menu.propTypes = {
    handleNewChat: PropTypes.func.isRequired,
};

export default Menu;
