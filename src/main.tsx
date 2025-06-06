import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/assets/fonts/fonts.css'
import '@/index.css'
import App from '@/App.tsx'
import RouteProvider from '@/router/Provider.tsx'
import { ChakraProvider } from '@chakra-ui/react'
import { AdvancedQueryClientProvider } from '@/lib/tanstack-query/QueryClientProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider>
      <AdvancedQueryClientProvider>
        <RouteProvider>
          <App />
        </RouteProvider>
      </AdvancedQueryClientProvider>
    </ChakraProvider>
  </StrictMode>
)
