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
