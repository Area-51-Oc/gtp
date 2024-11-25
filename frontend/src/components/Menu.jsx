import { useState } from 'react';
import viewchat from '../assets/chats.png';
import newChat from '../assets/new-chat.png';
import PropTypes from 'prop-types';

function Menu({ handleNewChat, chats }) {
    const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);

    return (
        <aside className={`menu ${isMenuCollapsed ? 'collapsed' : ''}`}>
            <div className="acciones">
                <button onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}>
                    <img src={viewchat} alt="Ver chats existentes" />
                </button>
                <button onClick={() => handleNewChat()}>
                    <img src={newChat} alt="Iniciar nuevo chat" />
                </button>
            </div>

            {!isMenuCollapsed && (
                <>
                    <h3>
                        OC AI Chat <span className="beta">Beta</span>
                    </h3>
                    <div className="chats">
                        {chats.length > 0 ? (
                            chats.map((chat) => (
                                <div key={chat.id} className="chat-history">
                                    <p>Conversación #{chat.id}: {chat.message}</p>
                                </div>
                            ))
                        ) : (
                            <p>No hay conversaciones aún</p>
                        )}
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
    chats: PropTypes.array.isRequired,
};

export default Menu;
