import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: 'var(--bg2)',
          color: 'var(--text)',
          border: '1px solid var(--border2)',
          borderRadius: '10px',
          fontFamily: 'var(--font)',
          fontSize: '13px',
        },
        success: { iconTheme: { primary: 'var(--green)', secondary: 'var(--bg2)' } },
        error: { iconTheme: { primary: 'var(--red)', secondary: 'var(--bg2)' } },
      }}
    />
  </React.StrictMode>,
)
