import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/assets/fonts/fonts.css'
import '@/index.css'
import App from '@/App.tsx'
import RouteProvider from '@/router/Provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouteProvider>
      <App />
    </RouteProvider>
  </StrictMode>
)
