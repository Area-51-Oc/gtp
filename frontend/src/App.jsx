import { useState } from 'react'
import './App.css'
import Conversacion from './components/Conversacion'
import Main from './components/Main'
import Menu from './components/Menu'

function App() {
  const [newChat, setNewChat] = useState(true)

  const handleNewChat = () => {
    setNewChat(true);
  }

  const handleConversacion = () => {
    setNewChat(false);
  }

  return (
    <>
      <div className='container'>
        <Menu handleNewChat={handleNewChat} />
        { newChat ? <Main handleConversacion={handleConversacion} /> : <Conversacion /> }
      </div>
    </>
  )
}

export default App
