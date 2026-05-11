import { useMemo } from 'react'
import type { LeasingAnlageResult } from '@/shared/types'
import { leasingExcessKm, compoundGrowthSchedule } from '@/shared/utils/calculations'
import { formatEuro } from '@/shared/utils/format'
import { useCalculator } from '@/state/CalculatorContext'

export default function LeasingAnlageModule() {
  const { state: { leasingAnlage: inputs }, updateLeasingAnlage } = useCalculator()

  const result = useMemo((): LeasingAnlageResult => {
    const totalWithoutSonderzahlung = inputs.monthlyRate * inputs.termMonths
    const { excessMileageTotal } = leasingExcessKm(
      inputs.annualMileage,
      inputs.mileageLimit,
      inputs.termMonths,
      inputs.excessKmCost,
    )
    const leasingTotalCost = inputs.sonderzahlung + totalWithoutSonderzahlung + excessMileageTotal

    const years = inputs.termMonths / 12
    const investmentFutureValue = inputs.investmentAmount * Math.pow(1 + inputs.annualReturnRate / 100, years)
    const investmentSchedule = compoundGrowthSchedule(inputs.investmentAmount, inputs.annualReturnRate, Math.ceil(years))

    const netDifference = investmentFutureValue - leasingTotalCost

    return {
      leasingTotalCost,
      investmentFutureValue,
      netDifference,
      isBetterThanCash: netDifference > 0,
      investmentSchedule,
    }
  }, [inputs])

  const update = (key: string, value: number) => updateLeasingAnlage({ [key]: value })

  const years = inputs.termMonths / 12

  return (
    <div>
      <h2>Leasing + Anlage</h2>
      <p className="module-intro">
        Diese Strategie kombiniert <strong>Leasing</strong> mit einer <strong>Geldanlage</strong>:
        Statt das Fahrzeug bar zu kaufen, leasen Sie es und legen den Barkaufbetrag am Kapitalmarkt
        an (z.&nbsp;B. ETF mit <strong>{inputs.annualReturnRate}&nbsp;% p.a.</strong>).
        Der Rechner zeigt, ob sich Leasing lohnt, wenn das freie Kapital für Sie arbeitet.
      </p>

      <div className="calc-card">
        <h3>Eingabe — Leasing</h3>
        <div className="calc-grid">
          <div className="calc-field">
            <label htmlFor="la-price">Fahrzeugpreis (Listenpreis)</label>
            <input
              id="la-price"
              type="number"
              value={inputs.vehiclePrice}
              onChange={(e) => update('vehiclePrice', Number(e.target.value))}
            />
            <span className="unit">€</span>
          </div>
          <div className="calc-field">
            <label htmlFor="la-rate">Monatliche Leasingrate</label>
            <input
              id="la-rate"
              type="number"
              value={inputs.monthlyRate}
              onChange={(e) => update('monthlyRate', Number(e.target.value))}
            />
            <span className="unit">€</span>
          </div>
          <div className="calc-field">
            <label htmlFor="la-term">Laufzeit</label>
            <input
              id="la-term"
              type="number"
              value={inputs.termMonths}
              onChange={(e) => update('termMonths', Number(e.target.value))}
            />
            <span className="unit">Monate</span>
          </div>
          <div className="calc-field">
            <label htmlFor="la-sonder">Sonderzahlung</label>
            <input
              id="la-sonder"
              type="number"
              value={inputs.sonderzahlung}
              onChange={(e) => update('sonderzahlung', Number(e.target.value))}
            />
            <span className="unit">€</span>
          </div>
          <div className="calc-field">
            <label htmlFor="la-km-year">Jährliche Fahrleistung</label>
            <input
              id="la-km-year"
              type="number"
              value={inputs.annualMileage}
              onChange={(e) => update('annualMileage', Number(e.target.value))}
            />
            <span className="unit">km</span>
          </div>
          <div className="calc-field">
            <label htmlFor="la-km-limit">Kilometerbegrenzung / Jahr</label>
            <input
              id="la-km-limit"
              type="number"
              value={inputs.mileageLimit}
              onChange={(e) => update('mileageLimit', Number(e.target.value))}
            />
            <span className="unit">km</span>
          </div>
          <div className="calc-field">
            <label htmlFor="la-excess-cost">Kosten pro Mehrkilometer</label>
            <input
              id="la-excess-cost"
              type="number"
              step="0.01"
              value={inputs.excessKmCost}
              onChange={(e) => update('excessKmCost', Number(e.target.value))}
            />
            <span className="unit">€ / km</span>
          </div>
        </div>
      </div>

      <div className="calc-card">
        <h3>Eingabe — Anlage</h3>
        <div className="calc-grid">
          <div className="calc-field">
            <label htmlFor="la-invest">Anlagebetrag (= Barkaufpreis)</label>
            <input
              id="la-invest"
              type="number"
              value={inputs.investmentAmount}
              onChange={(e) => update('investmentAmount', Number(e.target.value))}
            />
            <span className="unit">€</span>
          </div>
          <div className="calc-field">
            <label htmlFor="la-return">Jährliche Rendite</label>
            <input
              id="la-return"
              type="number"
              step="0.1"
              value={inputs.annualReturnRate}
              onChange={(e) => update('annualReturnRate', Number(e.target.value))}
            />
            <span className="unit">% p.a.</span>
          </div>
        </div>
      </div>

      <div className="calc-card">
        <h3>Ergebnis — Vergleich</h3>
        <div className="calc-results">
          <div className="result-box">
            <div className="label">Gesamtkosten Leasing</div>
            <div className="value negative">{formatEuro(result.leasingTotalCost)}</div>
            <div className="sub">über {inputs.termMonths} Monate</div>
          </div>
          <div className="result-box">
            <div className="label">Wert der Geldanlage</div>
            <div className="value positive">{formatEuro(Math.round(result.investmentFutureValue))}</div>
            <div className="sub">nach {years.toFixed(1)} Jahren</div>
          </div>
          <div className="result-box">
            <div className="label">Netto-Differenz</div>
            <div className={`value ${result.isBetterThanCash ? 'positive' : 'negative'}`}>
              {result.isBetterThanCash ? '+' : ''}
              {formatEuro(Math.round(result.netDifference))}
            </div>
            <div className="sub">
              {result.isBetterThanCash
                ? 'Anlage übersteigt Leasingkosten'
                : 'Leasing teurer als Anlagegewinn'}
            </div>
          </div>
          <div className="result-box">
            <div className="label">Anlagerendite gesamt</div>
            <div className="value positive">
              {((result.investmentFutureValue / inputs.investmentAmount - 1) * 100).toFixed(1)} %
            </div>
            <div className="sub">über {years.toFixed(1)} Jahre</div>
          </div>
        </div>
      </div>

      <div className="calc-card">
        <h3>Entwicklung der Geldanlage</h3>
        <table className="calc-table">
          <thead>
            <tr>
              <th>Jahr</th>
              <th>Anlagewert</th>
              <th>Gewinn</th>
            </tr>
          </thead>
          <tbody>
            {result.investmentSchedule.map((row) => (
              <tr key={row.year}>
                <td>{row.year}</td>
                <td>{formatEuro(Math.round(row.value))}</td>
                <td>{formatEuro(Math.round(row.value - inputs.investmentAmount))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
