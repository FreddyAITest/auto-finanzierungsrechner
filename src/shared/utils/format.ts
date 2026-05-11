const EUR_FORMATTER = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const PERCENT_FORMATTER = new Intl.NumberFormat('de-DE', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
})

const NUMBER_FORMATTER = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export function formatEuro(value: number): string {
  return EUR_FORMATTER.format(value)
}

export function formatPercent(value: number): string {
  return PERCENT_FORMATTER.format(value / 100)
}

export function formatNumber(value: number): string {
  return NUMBER_FORMATTER.format(value)
}
