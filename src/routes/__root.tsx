import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Header } from '../components/Header/Header'
import '../index.css'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
