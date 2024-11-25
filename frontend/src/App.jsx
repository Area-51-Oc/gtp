import { useState } from 'react';
import './App.css';
import Conversacion from './components/Conversacion';
import Main from './components/Main';
import Menu from './components/Menu';

function App() {
  const [newChat, setNewChat] = useState(true);
  const [chats, setChats] = useState([]); // Estado para las conversaciones

  const handleNewChat = () => {
    setNewChat(true);
  };

  const handleConversacion = (message) => {

    setChats((prevChats) => [...prevChats, { id: prevChats.length + 1, message }]);
    setNewChat(false);
  };

  return (
    <>
      <div className='container'>
        <Menu handleNewChat={handleNewChat} chats={chats} />
        {newChat ? (
          <Main handleConversacion={handleConversacion} />
        ) : (
          <Conversacion />
        )}
      </div>
    </>
  );
}

export default App;
