import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import favicon from './assets/favicon.png'

// Set the favicon
document.querySelector('link[rel="icon"]').href = favicon;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    
  </StrictMode>,
)
