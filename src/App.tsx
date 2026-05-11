import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@/layout/MainLayout'
import BarkaufModule from '@/modules/barkauf'
import LeasingModule from '@/modules/leasing'
import LeasingAnlageModule from '@/modules/leasing-anlage'
import GebrauchtwagenModule from '@/modules/gebrauchtwagen'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/barkauf" replace />} />
          <Route path="/barkauf" element={<BarkaufModule />} />
          <Route path="/leasing" element={<LeasingModule />} />
          <Route path="/leasing-anlage" element={<LeasingAnlageModule />} />
          <Route path="/gebrauchtwagen" element={<GebrauchtwagenModule />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
