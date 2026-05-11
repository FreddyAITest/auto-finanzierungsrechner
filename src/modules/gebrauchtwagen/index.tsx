import { useState, useMemo } from 'react'
import type { GebrauchtwagenInputs, GebrauchtwagenResult } from '@/shared/types'
import { depreciationSchedule } from '@/shared/utils/calculations'
import { formatEuro } from '@/shared/utils/format'

const DEFAULTS: GebrauchtwagenInputs = {
  purchasePrice: 18000,
  currentAge: 3,
  annualDepreciationRate: 8,
  years: 5,
}

export default function GebrauchtwagenModule() {
  const [inputs, setInputs] = useState<GebrauchtwagenInputs>(DEFAULTS)

  const result = useMemo((): GebrauchtwagenResult => {
    const amortizationSchedule = depreciationSchedule(
      inputs.purchasePrice,
      inputs.annualDepreciationRate,
      inputs.years,
    )
    const totalDepreciation = amortizationSchedule.reduce((sum, y) => sum + y.depreciation, 0)
    const finalValue = amortizationSchedule[amortizationSchedule.length - 1]?.endValue ?? inputs.purchasePrice
    return { amortizationSchedule, totalDepreciation, finalValue }
  }, [inputs])

  const update = (key: keyof GebrauchtwagenInputs, value: number) =>
    setInputs((prev) => ({ ...prev, [key]: value }))

  return (
    <div>
      <h2>Gebrauchtwagen</h2>
      <p className="module-intro">
        Ein <strong>Gebrauchtwagen</strong> hat den stärksten Wertverlust bereits hinter sich.
        Die jährliche Abschreibung ist deutlich geringer als beim Neuwagen — typisch sind{' '}
        <strong>6–10&nbsp;%</strong> statt 15–25&nbsp;%. Dadurch bleiben die Gesamtkosten
        über die Haltedauer niedriger.
      </p>

      <div className="calc-card">
        <h3>Eingabe</h3>
        <div className="calc-grid">
          <div className="calc-field">
            <label htmlFor="gw-price">Kaufpreis</label>
            <input
              id="gw-price"
              type="number"
              value={inputs.purchasePrice}
              onChange={(e) => update('purchasePrice', Number(e.target.value))}
            />
            <span className="unit">€</span>
          </div>
          <div className="calc-field">
            <label htmlFor="gw-age">Aktuelles Fahrzeugalter</label>
            <input
              id="gw-age"
              type="number"
              value={inputs.currentAge}
              onChange={(e) => update('currentAge', Number(e.target.value))}
            />
            <span className="unit">Jahre</span>
          </div>
          <div className="calc-field">
            <label htmlFor="gw-depr">Jährlicher Wertverlust</label>
            <input
              id="gw-depr"
              type="number"
              step="0.1"
              value={inputs.annualDepreciationRate}
              onChange={(e) => update('annualDepreciationRate', Number(e.target.value))}
            />
            <span className="unit">% (ca. 6–10 % für Gebrauchtwagen)</span>
          </div>
          <div className="calc-field">
            <label htmlFor="gw-years">Betrachtungszeitraum</label>
            <input
              id="gw-years"
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
            <div className="label">Fahrzeugalter am Ende</div>
            <div className="value">{inputs.currentAge + inputs.years} Jahre</div>
          </div>
        </div>
      </div>

      <div className="calc-card">
        <h3>Wertverlauf im Detail</h3>
        <table className="calc-table">
          <thead>
            <tr>
              <th>Jahr</th>
              <th>Alter</th>
              <th>Wert zu Jahresbeginn</th>
              <th>Wertverlust</th>
              <th>Restwert am Jahresende</th>
            </tr>
          </thead>
          <tbody>
            {result.amortizationSchedule.map((row) => (
              <tr key={row.year}>
                <td>{row.year}</td>
                <td>{inputs.currentAge + row.year} Jahre</td>
                <td>{formatEuro(row.startValue)}</td>
                <td>{formatEuro(row.depreciation)}</td>
                <td>{formatEuro(row.endValue)}</td>
              </tr>
            ))}
            <tr>
              <td>Gesamt</td>
              <td></td>
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
