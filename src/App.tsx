import Router from '@/router/Router'
import { useColorMode } from '@chakra-ui/react'
import { useEffect } from 'react'

export default function App() {
  const { setColorMode } = useColorMode()

  useEffect(() => {
    setColorMode('dark')
  }, [])

  return <Router />
}
