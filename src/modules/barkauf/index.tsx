import { useMemo } from 'react'
import type { BarkaufResult } from '@/shared/types'
import { depreciationSchedule } from '@/shared/utils/calculations'
import { formatEuro } from '@/shared/utils/format'
import { useCalculator } from '@/state/CalculatorContext'

export default function BarkaufModule() {
  const { state: { barkauf: inputs }, updateBarkauf } = useCalculator()

  const result = useMemo((): BarkaufResult => {
    const amortizationSchedule = depreciationSchedule(
      inputs.purchasePrice,
      inputs.annualDepreciationRate,
      inputs.years,
    )
    const totalDepreciation = amortizationSchedule.reduce((sum, y) => sum + y.depreciation, 0)
    const finalValue = amortizationSchedule[amortizationSchedule.length - 1]?.endValue ?? inputs.purchasePrice
    return { amortizationSchedule, totalDepreciation, finalValue }
  }, [inputs])

  const update = (key: string, value: number) => updateBarkauf({ [key]: value })

  return (
    <div>
      <h2>Barkauf</h2>
      <p className="module-intro">
        Beim <strong>Barkauf</strong> erwerben Sie das Fahrzeug sofort. Sie sind ab Tag 1 Eigentümer
        und zahlen keine Zinsen. Der größte Kostenfaktor ist der <strong>Wertverlust</strong> über
        die Zeit. Dieser Rechner zeigt, wie viel Ihr Neuwagen in den nächsten Jahren an Wert verliert.
      </p>

      <div className="calc-card">
        <h3>Eingabe</h3>
        <div className="calc-grid">
          <div className="calc-field">
            <label htmlFor="bp-price">Kaufpreis</label>
            <input
              id="bp-price"
              type="number"
              value={inputs.purchasePrice}
              onChange={(e) => update('purchasePrice', Number(e.target.value))}
            />
            <span className="unit">€</span>
          </div>
          <div className="calc-field">
            <label htmlFor="bp-depr">Jährlicher Wertverlust</label>
            <input
              id="bp-depr"
              type="number"
              step="0.1"
              value={inputs.annualDepreciationRate}
              onChange={(e) => update('annualDepreciationRate', Number(e.target.value))}
            />
            <span className="unit">%</span>
          </div>
          <div className="calc-field">
            <label htmlFor="bp-years">Betrachtungszeitraum</label>
            <input
              id="bp-years"
              type="number"
              value={inputs.years}
              onChange={(e) => update('years', Number(e.target.value))}
            />
            <span className="unit">Jahre</span>
          </div>
        </div>
      </div>

      <div className="calc-card">
        <h3>Ergebnis</h3>
        <div className="calc-results">
          <div className="result-box">
            <div className="label">Restwert nach {inputs.years} Jahren</div>
            <div className="value">{formatEuro(result.finalValue)}</div>
          </div>
          <div className="result-box">
            <div className="label">Gesamter Wertverlust</div>
            <div className="value negative">{formatEuro(result.totalDepreciation)}</div>
          </div>
          <div className="result-box">
            <div className="label">Wertverlust / Jahr</div>
            <div className="value negative">
              {formatEuro(Math.round(result.totalDepreciation / inputs.years))}
            </div>
          </div>
          <div className="result-box">
            <div className="label">Wertverlustrate gesamt</div>
            <div className="value negative">
              {((result.totalDepreciation / inputs.purchasePrice) * 100).toFixed(1)} %
            </div>
          </div>
        </div>
      </div>

      <div className="calc-card">
        <h3>Wertverlauf im Detail</h3>
        <table className="calc-table">
          <thead>
            <tr>
              <th>Jahr</th>
              <th>Wert zu Jahresbeginn</th>
              <th>Wertverlust</th>
              <th>Restwert am Jahresende</th>
            </tr>
          </thead>
          <tbody>
            {result.amortizationSchedule.map((row) => (
              <tr key={row.year}>
                <td>{row.year}</td>
                <td>{formatEuro(row.startValue)}</td>
                <td>{formatEuro(row.depreciation)}</td>
                <td>{formatEuro(row.endValue)}</td>
              </tr>
            ))}
            <tr>
              <td>Gesamt</td>
              <td>{formatEuro(inputs.purchasePrice)}</td>
              <td>{formatEuro(result.totalDepreciation)}</td>
              <td>{formatEuro(result.finalValue)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
