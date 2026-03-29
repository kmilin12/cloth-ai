import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { WardrobeProvider } from './context/WardrobeContext'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <WardrobeProvider>
          <App />
        </WardrobeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
