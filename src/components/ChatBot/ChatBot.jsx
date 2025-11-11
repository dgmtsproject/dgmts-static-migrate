import { Container, Header, MessageList, Composer, useWebchat } from '@botpress/webchat'
import { useState, useMemo, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react' // ✅ react-lucide icons
import logo from '../../assets/logos/cropped-logo.png'

const headerConfig = {
  botName: 'DGMTS Assistant',
  botAvatar: logo,
  botDescription: 'Your geotechnical engineering support assistant.',
  phone: {
    title: 'Call Us',
    link: 'tel:+17034889953',
  },
  email: {
    title: 'Email Us',
    link: 'mailto:info@dullesgeotechnical.com',
  },
  website: {
    title: 'Visit Our Website',
    link: 'https://www.dullesgeotechnical.com',
  },
  termsOfService: {
    title: 'Terms of Service',
    link: 'https://www.dullesgeotechnical.com/terms',
  },
  privacyPolicy: {
    title: 'Privacy Policy',
    link: 'https://www.dullesgeotechnical.com/privacy',
  },
}

function ChatBot() {
  const [isWebchatOpen, setIsWebchatOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const { client, messages, isTyping, user, clientState, newConversation } = useWebchat({
    clientId: '07dc3aad-934c-4afa-84c2-7c5b00dfb0aa',
  })

  const config = {
    botName: 'DGMTS Assistant',
    botAvatar: logo,
    botDescription: 'Your geotechnical engineering support assistant.',
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Remove any stale botpress webchat state on mount so the chat starts clean
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('bp-webchat')
      }
    } catch {
      // ignore storage errors (e.g., in private mode)
    }
  }, [])

  const enrichedMessages = useMemo(
    () =>
      messages.map((message) => {
        const { authorId } = message
        const direction = authorId === user?.userId ? 'outgoing' : 'incoming'
        return {
          ...message,
          direction,
          sender:
            direction === 'outgoing'
              ? { name: user?.name ?? 'You', avatar: user?.pictureUrl }
              : { name: config.botName ?? 'Bot', avatar: config.botAvatar },
        }
      }),
    [config.botAvatar, config.botName, messages, user?.userId, user?.name, user?.pictureUrl]
  )

  const toggleWebchat = () => {
    setIsWebchatOpen((prevState) => !prevState)
  }

  const chatContainerStyle = {
    width: isMobile ? '100vw' : '420px',
    height: isMobile ? '100vh' : '600px',
    display: isWebchatOpen ? 'flex' : 'none',
    position: 'fixed',
    bottom: isMobile ? '0px' : '90px',
    right: isMobile ? '0px' : '20px',
    left: isMobile ? '0px' : 'auto',
    zIndex: 10000,
    borderRadius: isMobile ? '0px' : '12px',
    boxShadow: isMobile 
      ? 'none' 
      : '0 10px 25px rgba(39, 149, 208, 0.15)',
    border: isMobile ? 'none' : '1px solid rgba(39, 149, 208, 0.1)',
    overflow: 'hidden',
    background: '#ffffff',
  }

  const fabButtonStyle = {
    position: 'fixed',
    bottom: isMobile && isWebchatOpen ? '100px' : '20px', // ✅ lifted up on mobile
    right: '20px',
    height: '56px',
    borderRadius: '28px',
    background: 'var(--primary-color, #2795d0)',
    border: 'none',
    outline: 'none',         // ✅ no black border
    boxShadow: '0 4px 12px rgba(39, 149, 208, 0.3)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 1001,
    color: 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: '600',
    fontSize: '14px',
    padding: '0 20px',
    gap: '8px',
    minWidth: isWebchatOpen ? '56px' : '160px',
    overflow: 'hidden',
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isWebchatOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 10000,
        }} onClick={toggleWebchat} />
      )}

      {/* Chat Container */}
      <Container
        connected={clientState !== 'disconnected'}
        style={chatContainerStyle}
      >
        <Header
          defaultOpen={false}
          closeWindow={() => setIsWebchatOpen(false)}
          restartConversation={newConversation}
          disabled={false}
          configuration={headerConfig}
        />
        <MessageList
          botName={config.botName}
          botDescription={config.botDescription}
          isTyping={isTyping}
          headerMessage="Chat History"
          showMarquee={true}
          messages={enrichedMessages}
          sendMessage={client?.sendMessage}
        />
        <Composer
          disableComposer={false}
          isReadOnly={false}
          allowFileUpload={true}
          connected={clientState !== 'disconnected'}
          sendMessage={client?.sendMessage}
          uploadFile={client?.uploadFile}
          composerPlaceholder="Type your message here..."
        />
      </Container>

      {/* Floating Action Button with Icon + Text */}
      <button
        onClick={toggleWebchat}
        style={fabButtonStyle}
        aria-label={isWebchatOpen ? 'Close DGMTS chat assistant' : 'Open DGMTS chat assistant'}
      >
        {isWebchatOpen ? (
          <X size={20} strokeWidth={2.2} />
        ) : (
          <>
            <MessageCircle size={20} strokeWidth={2.2} />
            <span>Chat with us</span>
          </>
        )}
      </button>
    </>
  )
}

export default ChatBot
