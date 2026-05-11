import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { BarkaufInputs, LeasingInputs, LeasingAnlageInputs, GebrauchtwagenInputs } from '@/shared/types'

const BARKAUF_DEFAULTS: BarkaufInputs = {
  purchasePrice: 40000,
  annualDepreciationRate: 15,
  years: 5,
}

const LEASING_DEFAULTS: LeasingInputs = {
  vehiclePrice: 40000,
  monthlyRate: 350,
  termMonths: 36,
  sonderzahlung: 3000,
  annualMileage: 15000,
  mileageLimit: 10000,
  excessKmCost: 0.15,
}

const LEASING_ANLAGE_DEFAULTS: LeasingAnlageInputs = {
  vehiclePrice: 40000,
  monthlyRate: 350,
  termMonths: 36,
  sonderzahlung: 3000,
  annualMileage: 15000,
  mileageLimit: 10000,
  excessKmCost: 0.15,
  investmentAmount: 40000,
  annualReturnRate: 3,
}

const GEBRAUCHTWAGEN_DEFAULTS: GebrauchtwagenInputs = {
  purchasePrice: 18000,
  currentAge: 3,
  annualDepreciationRate: 8,
  years: 5,
}

interface CalculatorState {
  barkauf: BarkaufInputs
  leasing: LeasingInputs
  leasingAnlage: LeasingAnlageInputs
  gebrauchtwagen: GebrauchtwagenInputs
}

interface CalculatorContextValue {
  state: CalculatorState
  updateBarkauf: (patch: Partial<BarkaufInputs>) => void
  updateLeasing: (patch: Partial<LeasingInputs>) => void
  updateLeasingAnlage: (patch: Partial<LeasingAnlageInputs>) => void
  updateGebrauchtwagen: (patch: Partial<GebrauchtwagenInputs>) => void
}

const CalculatorContext = createContext<CalculatorContextValue | null>(null)

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CalculatorState>({
    barkauf: BARKAUF_DEFAULTS,
    leasing: LEASING_DEFAULTS,
    leasingAnlage: LEASING_ANLAGE_DEFAULTS,
    gebrauchtwagen: GEBRAUCHTWAGEN_DEFAULTS,
  })

  const updateBarkauf = useCallback(
    (patch: Partial<BarkaufInputs>) =>
      setState((prev) => ({ ...prev, barkauf: { ...prev.barkauf, ...patch } })),
    [],
  )

  const updateLeasing = useCallback(
    (patch: Partial<LeasingInputs>) =>
      setState((prev) => ({ ...prev, leasing: { ...prev.leasing, ...patch } })),
    [],
  )

  const updateLeasingAnlage = useCallback(
    (patch: Partial<LeasingAnlageInputs>) =>
      setState((prev) => ({ ...prev, leasingAnlage: { ...prev.leasingAnlage, ...patch } })),
    [],
  )

  const updateGebrauchtwagen = useCallback(
    (patch: Partial<GebrauchtwagenInputs>) =>
      setState((prev) => ({ ...prev, gebrauchtwagen: { ...prev.gebrauchtwagen, ...patch } })),
    [],
  )

  return (
    <CalculatorContext.Provider
      value={{ state, updateBarkauf, updateLeasing, updateLeasingAnlage, updateGebrauchtwagen }}
    >
      {children}
    </CalculatorContext.Provider>
  )
}

export function useCalculator() {
  const ctx = useContext(CalculatorContext)
  if (!ctx) throw new Error('useCalculator must be used within CalculatorProvider')
  return ctx
}
