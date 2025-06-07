import { lazy } from 'react'
import ROUTE_PATH from '@/router/path'
import { Route, Routes } from 'react-router-dom'

const Home = lazy(() => import('@/pages/Home/Home'))

export default function Router() {
  return (
    <Routes>
      <Route path={ROUTE_PATH.HOME} element={<Home />} />
    </Routes>
  )
}
