import { Router } from 'react-router-dom'
import { createBrowserHistory, type Update } from 'history'
import {
  useLayoutEffect,
  useState,
  startTransition,
  type ReactNode,
} from 'react'

const history = createBrowserHistory()

type TRouteProvider = {
  children: ReactNode
  basename?: string
}

function RouteProvider({ children, basename }: TRouteProvider) {
  const [routeState, setRouteState] = useState({
    action: history.action,
    location: history.location,
  })

  useLayoutEffect(() => {
    const unlisten = history.listen((update: Update) => {
      startTransition(() => {
        setRouteState(update)
      })
    })
    return () => unlisten()
  }, [])

  return (
    <Router
      basename={basename}
      location={routeState.location}
      navigationType={routeState.action}
      navigator={history}
    >
      {children}
    </Router>
  )
}

export default RouteProvider
