import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { VergleichResult, VergleichOption } from '@/shared/types'
import {
  depreciationSchedule,
  leasingExcessKm,
} from '@/shared/utils/calculations'
import { formatEuro } from '@/shared/utils/format'
import { useCalculator } from '@/state/CalculatorContext'

function computeBarkaufOption(inputs: {
  purchasePrice: number
  annualDepreciationRate: number
  years: number
}): VergleichOption {
  const schedule = depreciationSchedule(
    inputs.purchasePrice,
    inputs.annualDepreciationRate,
    inputs.years,
  )
  const totalDepreciation = schedule.reduce((sum, y) => sum + y.depreciation, 0)
  const finalValue = schedule[schedule.length - 1]?.endValue ?? inputs.purchasePrice
  return {
    label: 'Barkauf',
    route: '/barkauf',
    totalCost: totalDepreciation,
    periodMonths: inputs.years * 12,
    monthlyCost: totalDepreciation / (inputs.years * 12),
    annualCost: totalDepreciation / inputs.years,
    keyDetail: `Restwert: ${formatEuro(finalValue)}`,
    assetValue: finalValue,
  }
}

function computeLeasingOption(inputs: {
  monthlyRate: number
  termMonths: number
  sonderzahlung: number
  annualMileage: number
  mileageLimit: number
  excessKmCost: number
}): VergleichOption {
  const totalWithoutSonderzahlung = inputs.monthlyRate * inputs.termMonths
  const { excessMileageTotal } = leasingExcessKm(
    inputs.annualMileage,
    inputs.mileageLimit,
    inputs.termMonths,
    inputs.excessKmCost,
  )
  const totalCost = inputs.sonderzahlung + totalWithoutSonderzahlung + excessMileageTotal
  return {
    label: 'Leasing',
    route: '/leasing',
    totalCost,
    periodMonths: inputs.termMonths,
    monthlyCost: totalCost / inputs.termMonths,
    annualCost: (totalCost / inputs.termMonths) * 12,
    keyDetail: `inkl. Sonderzahlung ${formatEuro(inputs.sonderzahlung)}`,
    assetValue: 0,
  }
}

function computeLeasingAnlageOption(inputs: {
  vehiclePrice: number
  monthlyRate: number
  termMonths: number
  sonderzahlung: number
  annualMileage: number
  mileageLimit: number
  excessKmCost: number
  investmentAmount: number
  annualReturnRate: number
}): VergleichOption {
  const totalWithoutSonderzahlung = inputs.monthlyRate * inputs.termMonths
  const { excessMileageTotal } = leasingExcessKm(
    inputs.annualMileage,
    inputs.mileageLimit,
    inputs.termMonths,
    inputs.excessKmCost,
  )
  const leasingTotalCost = inputs.sonderzahlung + totalWithoutSonderzahlung + excessMileageTotal
  const years = inputs.termMonths / 12
  const investmentFutureValue =
    inputs.investmentAmount * Math.pow(1 + inputs.annualReturnRate / 100, years)
  const investmentGain = investmentFutureValue - inputs.investmentAmount
  const effectiveCost = leasingTotalCost - investmentGain
  return {
    label: 'Leasing + Anlage',
    route: '/leasing-anlage',
    totalCost: effectiveCost,
    periodMonths: inputs.termMonths,
    monthlyCost: effectiveCost / inputs.termMonths,
    annualCost: (effectiveCost / inputs.termMonths) * 12,
    keyDetail: `Anlagegewinn: ${formatEuro(Math.round(investmentGain))}`,
    assetValue: investmentFutureValue,
  }
}

function computeGebrauchtwagenOption(inputs: {
  purchasePrice: number
  currentAge: number
  annualDepreciationRate: number
  years: number
}): VergleichOption {
  const schedule = depreciationSchedule(
    inputs.purchasePrice,
    inputs.annualDepreciationRate,
    inputs.years,
  )
  const totalDepreciation = schedule.reduce((sum, y) => sum + y.depreciation, 0)
  const finalValue = schedule[schedule.length - 1]?.endValue ?? inputs.purchasePrice
  return {
    label: 'Gebrauchtwagen',
    route: '/gebrauchtwagen',
    totalCost: totalDepreciation,
    periodMonths: inputs.years * 12,
    monthlyCost: totalDepreciation / (inputs.years * 12),
    annualCost: totalDepreciation / inputs.years,
    keyDetail: `Alter bei Kauf: ${inputs.currentAge} Jahre`,
    assetValue: finalValue,
  }
}

export default function VergleichModule() {
  const { state } = useCalculator()

  const result = useMemo((): VergleichResult => {
    const options = [
      computeBarkaufOption(state.barkauf),
      computeLeasingOption(state.leasing),
      computeLeasingAnlageOption(state.leasingAnlage),
      computeGebrauchtwagenOption(state.gebrauchtwagen),
    ]

    const bestAnnualCost = Math.min(...options.map((o) => o.annualCost))
    const bestOption = options.find((o) => o.annualCost === bestAnnualCost)!.label

    return { options, bestOption, bestAnnualCost }
  }, [state])

  return (
    <div>
      <h2>Vergleich</h2>
      <p className="module-intro">
        Der <strong>Vergleich</strong> stellt alle vier Finanzierungsmodelle gegenüber. Die Kosten
        werden als jährliche Belastung dargestellt, um einen fairen Vergleich trotz
        unterschiedlicher Laufzeiten zu ermöglichen. Das wirtschaftlich beste Modell ist
        hervorgehoben.
      </p>

      <div className="calc-card">
        <h3>Jährliche Kosten im Vergleich</h3>
        <table className="calc-table">
          <thead>
            <tr>
              <th>Modell</th>
              <th>Laufzeit</th>
              <th>Kosten / Jahr</th>
              <th>Kosten / Monat</th>
              <th>Gesamtkosten</th>
              <th>Vermögen am Ende</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {result.options.map((opt) => {
              const isBest = opt.label === result.bestOption
              return (
                <tr key={opt.label}>
                  <td>
                    {isBest && <span className="best-badge">Beste Wahl</span>}
                    {opt.label}
                  </td>
                  <td>{(opt.periodMonths / 12).toFixed(1)} Jahre</td>
                  <td className={isBest ? 'cost-best' : 'cost-normal'}>
                    {formatEuro(Math.round(opt.annualCost))}
                  </td>
                  <td>{formatEuro(Math.round(opt.monthlyCost))}</td>
                  <td>
                    <span className={opt.totalCost < 0 ? 'positive' : undefined}>
                      {formatEuro(Math.round(opt.totalCost))}
                    </span>
                  </td>
                  <td>{formatEuro(Math.round(opt.assetValue))}</td>
                  <td>
                    <Link to={opt.route} className="inline-link">
                      Details →
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="calc-card">
        <h3>Analyse</h3>
        <div className="calc-results">
          {result.options.map((opt) => {
            const isBest = opt.label === result.bestOption
            return (
              <div
                key={opt.label}
                className={`result-box ${isBest ? 'result-box-best' : ''}`}
              >
                <div className="label">
                  {opt.label}
                  {isBest && ' — Günstigste Option'}
                </div>
                <div className={`value ${isBest ? 'positive' : ''}`}>
                  {formatEuro(Math.round(opt.annualCost))}
                  <span className="sub"> / Jahr</span>
                </div>
                <div className="sub">{opt.keyDetail}</div>
                {!isBest && (
                  <div className="sub cost-diff">
                    {formatEuro(Math.round(opt.annualCost - result.bestAnnualCost))} mehr
                    pro Jahr
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
