import React, { useState } from 'react'
import { api } from '../../lib/api.js'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [vendorId, setVendorId] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Step 1 fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [vendorType, setVendorType] = useState('individual')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('')

  // Step 2 fields
  const [technicalInterests, setTechnicalInterests] = useState('React, Node.js')

  const submitStep1 = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const body = { name, email, phone, vendorType, address: { city, state, country } }
      const res = await api.post('/vendor-registration/step-1', body)
      setVendorId(res.id)
      setStep(2)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const submitStep2 = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const arr = technicalInterests.split(',').map(s => s.trim()).filter(Boolean)
      await api.put(`/vendor-registration/step-2/${vendorId}`, { technicalInterests: arr })
      setStep(3)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (step === 3) {
    return (
      <div className="max-w-lg mx-auto border border-[var(--border)] rounded-lg p-4 bg-[var(--card)]">
        <h2 className="text-xl font-semibold mb-2">You're all set 🎉</h2>
        <p className="text-[var(--muted)]">Vendor ID: {vendorId}</p>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      {step === 1 && (
        <form onSubmit={submitStep1} className="grid gap-3 border border-[var(--border)] rounded-lg p-4 bg-[var(--card)]">
          <h2 className="text-xl font-semibold">Vendor onboarding - Step 1</h2>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="border rounded px-3 py-2 bg-transparent" />
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border rounded px-3 py-2 bg-transparent" />
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" className="border rounded px-3 py-2 bg-transparent" />
          <select value={vendorType} onChange={e => setVendorType(e.target.value)} className="border rounded px-3 py-2 bg-transparent">
                            <option value="individual">Individual</option>
                <option value="agency">Agency</option>
                <option value="startup">Startup</option>
          </select>
          <div className="grid grid-cols-3 gap-2">
            <input value={city} onChange={e => setCity(e.target.value)} placeholder="City" className="border rounded px-3 py-2 bg-transparent" />
            <input value={state} onChange={e => setState(e.target.value)} placeholder="State" className="border rounded px-3 py-2 bg-transparent" />
            <input value={country} onChange={e => setCountry(e.target.value)} placeholder="Country" className="border rounded px-3 py-2 bg-transparent" />
          </div>
          <button disabled={loading} className="px-4 py-2 rounded bg-brand text-brand-fg disabled:opacity-60">Continue</button>
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </form>
      )}

      {step === 2 && (
        <form onSubmit={submitStep2} className="grid gap-3 border border-[var(--border)] rounded-lg p-4 bg-[var(--card)] mt-4">
          <h2 className="text-xl font-semibold">Vendor onboarding - Step 2</h2>
          <input value={technicalInterests} onChange={e => setTechnicalInterests(e.target.value)} placeholder="Technical interests (comma-separated)" className="border rounded px-3 py-2 bg-transparent" />
          <button disabled={loading} className="px-4 py-2 rounded bg-brand text-brand-fg disabled:opacity-60">Finish</button>
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </form>
      )}
    </div>
  )
}


