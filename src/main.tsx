import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/assets/fonts/fonts.css'
import '@/index.css'
import App from '@/App.tsx'
import RouteProvider from '@/router/Provider.tsx'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/tanstack-query/query-client'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <RouteProvider>
          <App />
        </RouteProvider>
      </QueryClientProvider>
    </ChakraProvider>
  </StrictMode>
)
