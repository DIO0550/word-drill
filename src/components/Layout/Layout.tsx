import { Header } from '../../widgets/Header/Header'
import { ScrollRestoration } from '@tanstack/react-router'
import './Layout.scss'

type LayoutProps = {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <Header />
      <main className="layout__main">{children}</main>
      <ScrollRestoration />
    </div>
  )
}
