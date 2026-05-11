// Shared financial calculation helpers.
// Each calculator module may also define its own module-specific math.
// These are common primitives used across scenarios.

export function monthlyInterestRate(annualRatePercent: number): number {
  return annualRatePercent / 100 / 12
}

export function monthlyPayment(
  principal: number,
  annualRatePercent: number,
  months: number,
): number {
  const r = monthlyInterestRate(annualRatePercent)
  if (r === 0) return principal / months
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
}

export function futureValue(
  presentValue: number,
  annualRatePercent: number,
  years: number,
): number {
  return presentValue * Math.pow(1 + annualRatePercent / 100, years)
}

export function depreciationSchedule(
  purchasePrice: number,
  annualDepreciationRate: number,
  years: number,
): Array<{ year: number; startValue: number; depreciation: number; endValue: number }> {
  const schedule = []
  let currentValue = purchasePrice
  for (let y = 1; y <= years; y++) {
    const depreciation = currentValue * (annualDepreciationRate / 100)
    const endValue = currentValue - depreciation
    schedule.push({ year: y, startValue: currentValue, depreciation, endValue })
    currentValue = endValue
  }
  return schedule
}

export function compoundGrowthSchedule(
  initialAmount: number,
  annualRatePercent: number,
  years: number,
): Array<{ year: number; value: number }> {
  const schedule = []
  let value = initialAmount
  for (let y = 1; y <= years; y++) {
    value = value * (1 + annualRatePercent / 100)
    schedule.push({ year, value })
  }
  return schedule
}

export function leasingExcessKm(
  annualMileage: number,
  mileageLimit: number,
  termMonths: number,
  excessKmCost: number,
): { excessKm: number; excessMileageTotal: number } {
  const termYears = termMonths / 12
  const totalKm = annualMileage * termYears
  const totalLimit = mileageLimit * termYears
  const excessKm = Math.max(0, totalKm - totalLimit)
  return { excessKm, excessMileageTotal: excessKm * excessKmCost }
}
