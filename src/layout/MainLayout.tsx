import { NavLink, Outlet } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/barkauf', label: 'Barkauf' },
  { to: '/leasing', label: 'Leasing' },
  { to: '/leasing-anlage', label: 'Leasing + Anlage' },
  { to: '/gebrauchtwagen', label: 'Gebrauchtwagen' },
]

export default function MainLayout() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <h1>Auto-Finanzierungsrechner</h1>
        <p className="subtitle">Faktenbasierte Vergleiche für Ihre Fahrzeug-Finanzierung</p>
        <nav>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
