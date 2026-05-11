import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CalculatorProvider } from '@/state/CalculatorContext'
import MainLayout from '@/layout/MainLayout'
import BarkaufModule from '@/modules/barkauf'
import LeasingModule from '@/modules/leasing'
import LeasingAnlageModule from '@/modules/leasing-anlage'
import GebrauchtwagenModule from '@/modules/gebrauchtwagen'
import VergleichModule from '@/modules/vergleich'

export default function App() {
  return (
    <BrowserRouter>
      <CalculatorProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/vergleich" replace />} />
            <Route path="/barkauf" element={<BarkaufModule />} />
            <Route path="/leasing" element={<LeasingModule />} />
            <Route path="/leasing-anlage" element={<LeasingAnlageModule />} />
            <Route path="/gebrauchtwagen" element={<GebrauchtwagenModule />} />
            <Route path="/vergleich" element={<VergleichModule />} />
          </Route>
        </Routes>
      </CalculatorProvider>
    </BrowserRouter>
  )
}
