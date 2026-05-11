export interface AmortizationYear {
  year: number
  startValue: number
  depreciation: number
  endValue: number
}

export interface BarkaufInputs {
  purchasePrice: number
  annualDepreciationRate: number
  years: number
}

export interface BarkaufResult {
  amortizationSchedule: AmortizationYear[]
  totalDepreciation: number
  finalValue: number
}

export interface LeasingInputs {
  vehiclePrice: number
  monthlyRate: number
  termMonths: number
  sonderzahlung: number
  annualMileage: number
  mileageLimit: number
  excessKmCost: number
}

export interface LeasingResult {
  totalCost: number
  totalWithoutSonderzahlung: number
  monthlyEffective: number
  excessMileageTotal: number
  excessKm: number
}

export interface LeasingAnlageInputs extends LeasingInputs {
  investmentAmount: number
  annualReturnRate: number
}

export interface LeasingAnlageResult {
  leasingTotalCost: number
  investmentFutureValue: number
  netDifference: number
  isBetterThanCash: boolean
  investmentSchedule: { year: number; value: number }[]
}

export interface GebrauchtwagenInputs {
  purchasePrice: number
  currentAge: number
  annualDepreciationRate: number
  years: number
}

export interface GebrauchtwagenResult {
  amortizationSchedule: AmortizationYear[]
  totalDepreciation: number
  finalValue: number
}

export interface VergleichOption {
  label: string
  route: string
  totalCost: number
  periodMonths: number
  monthlyCost: number
  annualCost: number
  keyDetail: string
  assetValue: number
}

export interface VergleichResult {
  options: VergleichOption[]
  bestOption: string
  bestAnnualCost: number
}
