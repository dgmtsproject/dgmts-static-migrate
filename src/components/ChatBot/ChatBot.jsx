import { Fab, Webchat } from '@botpress/webchat'
import { useState } from 'react'
import botAvatar from '../../assets/robot.png'

function ChatBot() {
  const [isWebchatOpen, setIsWebchatOpen] = useState(false)
  const toggleWebchat = () => {
    setIsWebchatOpen((prevState) => !prevState)
  }
  return (
    <>
      <Webchat
        clientId="07dc3aad-934c-4afa-84c2-7c5b00dfb0aa" // Your client ID here
        configuration={{ botName: 'DGMTS Assitant', botAvatar }}
        style={{
          width: '400px',
          height: '600px',
          display: isWebchatOpen ? 'flex' : 'none',
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          zIndex: 1000,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      />
      <Fab
        onClick={() => toggleWebchat()}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '64px',
          height: '64px'
        }}
      />
    </>
  )
}

export default ChatBot