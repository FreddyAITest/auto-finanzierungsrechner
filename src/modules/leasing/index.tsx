import { useState, useMemo } from 'react'
import type { LeasingInputs, LeasingResult } from '@/shared/types'
import { leasingExcessKm } from '@/shared/utils/calculations'
import { formatEuro } from '@/shared/utils/format'

const DEFAULTS: LeasingInputs = {
  vehiclePrice: 40000,
  monthlyRate: 350,
  termMonths: 36,
  sonderzahlung: 3000,
  annualMileage: 15000,
  mileageLimit: 10000,
  excessKmCost: 0.15,
}

export default function LeasingModule() {
  const [inputs, setInputs] = useState<LeasingInputs>(DEFAULTS)

  const result = useMemo((): LeasingResult => {
    const totalWithoutSonderzahlung = inputs.monthlyRate * inputs.termMonths
    const { excessKm, excessMileageTotal } = leasingExcessKm(
      inputs.annualMileage,
      inputs.mileageLimit,
      inputs.termMonths,
      inputs.excessKmCost,
    )
    const totalCost = inputs.sonderzahlung + totalWithoutSonderzahlung + excessMileageTotal
    const monthlyEffective = totalCost / inputs.termMonths
    return { totalCost, totalWithoutSonderzahlung, monthlyEffective, excessMileageTotal, excessKm }
  }, [inputs])

  const update = (key: keyof LeasingInputs, value: number) =>
    setInputs((prev) => ({ ...prev, [key]: value }))

  return (
    <div>
      <h2>Leasing</h2>
      <p className="module-intro">
        Beim <strong>Leasing</strong> zahlen Sie eine monatliche Rate für die Nutzung des
        Fahrzeugs, ohne Eigentümer zu werden. Am Ende der Laufzeit geben Sie das Fahrzeug
        zurück. Zusätzlich zur Rate fallen oft eine <strong>Sonderzahlung</strong> und ggf.
        Kosten für <strong>Mehrkilometer</strong> an.
      </p>

      <div className="calc-card">
        <h3>Eingabe</h3>
        <div className="calc-grid">
          <div className="calc-field">
            <label htmlFor="ls-price">Fahrzeugpreis (Listenpreis)</label>
            <input
              id="ls-price"
              type="number"
              value={inputs.vehiclePrice}
              onChange={(e) => update('vehiclePrice', Number(e.target.value))}
            />
            <span className="unit">€</span>
          </div>
          <div className="calc-field">
            <label htmlFor="ls-rate">Monatliche Leasingrate</label>
            <input
              id="ls-rate"
              type="number"
              value={inputs.monthlyRate}
              onChange={(e) => update('monthlyRate', Number(e.target.value))}
            />
            <span className="unit">€</span>
          </div>
          <div className="calc-field">
            <label htmlFor="ls-term">Laufzeit</label>
            <input
              id="ls-term"
              type="number"
              value={inputs.termMonths}
              onChange={(e) => update('termMonths', Number(e.target.value))}
            />
            <span className="unit">Monate</span>
          </div>
          <div className="calc-field">
            <label htmlFor="ls-sonder">Sonderzahlung</label>
            <input
              id="ls-sonder"
              type="number"
              value={inputs.sonderzahlung}
              onChange={(e) => update('sonderzahlung', Number(e.target.value))}
            />
            <span className="unit">€</span>
          </div>
          <div className="calc-field">
            <label htmlFor="ls-km-year">Jährliche Fahrleistung</label>
            <input
              id="ls-km-year"
              type="number"
              value={inputs.annualMileage}
              onChange={(e) => update('annualMileage', Number(e.target.value))}
            />
            <span className="unit">km</span>
          </div>
          <div className="calc-field">
            <label htmlFor="ls-km-limit">Kilometerbegrenzung / Jahr</label>
            <input
              id="ls-km-limit"
              type="number"
              value={inputs.mileageLimit}
              onChange={(e) => update('mileageLimit', Number(e.target.value))}
            />
            <span className="unit">km</span>
          </div>
          <div className="calc-field">
            <label htmlFor="ls-excess-cost">Kosten pro Mehrkilometer</label>
            <input
              id="ls-excess-cost"
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
        <h3>Ergebnis</h3>
        <div className="calc-results">
          <div className="result-box">
            <div className="label">Gesamtkosten Leasing</div>
            <div className="value negative">{formatEuro(result.totalCost)}</div>
            <div className="sub">über {inputs.termMonths} Monate</div>
          </div>
          <div className="result-box">
            <div className="label">Effektive Monatsrate</div>
            <div className="value">{formatEuro(Math.round(result.monthlyEffective))}</div>
            <div className="sub">inkl. Sonderzahlung & Mehr-km</div>
          </div>
          <div className="result-box">
            <div className="label">Raten gesamt</div>
            <div className="value">{formatEuro(result.totalWithoutSonderzahlung)}</div>
            <div className="sub">
              {inputs.termMonths} × {formatEuro(inputs.monthlyRate)}
            </div>
          </div>
          {result.excessKm > 0 && (
            <div className="result-box">
              <div className="label">Mehrkilometer-Kosten</div>
              <div className="value negative">{formatEuro(result.excessMileageTotal)}</div>
              <div className="sub">
                {result.excessKm.toLocaleString('de-DE')} km × {inputs.excessKmCost.toFixed(2)} €
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="calc-card">
        <h3>Kostenaufstellung</h3>
        <table className="calc-table">
          <thead>
            <tr>
              <th>Posten</th>
              <th>Betrag</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sonderzahlung</td>
              <td>{formatEuro(inputs.sonderzahlung)}</td>
            </tr>
            <tr>
              <td>Monatliche Raten ({inputs.termMonths} × {formatEuro(inputs.monthlyRate)})</td>
              <td>{formatEuro(result.totalWithoutSonderzahlung)}</td>
            </tr>
            {result.excessKm > 0 && (
              <tr>
                <td>Mehrkilometer ({result.excessKm.toLocaleString('de-DE')} km × {inputs.excessKmCost.toFixed(2)} €)</td>
                <td>{formatEuro(result.excessMileageTotal)}</td>
              </tr>
            )}
            <tr>
              <td>Gesamtkosten</td>
              <td>{formatEuro(result.totalCost)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
