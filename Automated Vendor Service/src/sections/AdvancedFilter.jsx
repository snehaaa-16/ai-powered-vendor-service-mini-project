import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'
import Section from './Section.jsx'

function List({ items, render }) {
  if (!items || items.length === 0) return <div>No results</div>
  return <div className="grid gap-3">{items.map(render)}</div>
}

function VendorCard({ vendor, meta }) {
  const v = vendor
  return (
    <div className="border border-[var(--border)] rounded-lg p-3 hover:shadow transition bg-[var(--card)]">
      <div className="flex items-center justify-between">
        <Link to={`/vendor/${v._id}`} className="font-semibold hover:underline">{v.name}</Link>
        <div className="text-sm text-[var(--muted)]">{v.location?.city}, {v.location?.state}</div>
      </div>
      <div className="mt-1 text-[var(--muted)]">{v.profile?.bio}</div>
      <div className="mt-2 flex gap-2 flex-wrap">
        {(v.skills || []).slice(0, 6).map(s => (
          <span key={s.name} className="border border-[var(--border)] rounded-full px-2 py-0.5 text-xs">{s.name}</span>
        ))}
      </div>
      <div className="mt-2 flex gap-4 text-xs">
        <span>⭐ {v.rating?.average ?? 0} ({v.rating?.totalReviews ?? 0})</span>
        <span>Availability: {v.availability?.isAvailable ? 'Yes' : 'No'}</span>
      </div>
      {meta && (
        <div className="mt-2 text-xs">
          <div>Match: {(meta.totalScore ?? meta.matchScore ?? 0).toFixed(2)}</div>
          {meta.breakdown && (
            <div className="flex gap-2 flex-wrap">
              {Object.entries(meta.breakdown).map(([k, v]) => (
                <span key={k} className="border border-[var(--border)] rounded px-1.5 py-0.5">{k}: {Number(v).toFixed(2)}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdvancedFilter() {
  const [skills, setSkills] = useState('React, Node.js')
  const [location, setLocation] = useState('Mumbai')
  const [experience, setExperience] = useState(3)
  const [budget, setBudget] = useState(50000)
  const [rating, setRating] = useState(4)
  const [availability, setAvailability] = useState('immediate')
  const [vendorType, setVendorType] = useState('individual')
  const [verified, setVerified] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const onSearch = async () => {
    setLoading(true)
    setError(null)
    try {
      const avail = availability === '' ? undefined : availability
      const body = {
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        location: location ? { city: location } : undefined,
        rating: rating || undefined,
        availability: avail,
        priceRange: budget ? { min: 0, max: budget } : undefined,
        page: 1,
        limit: 10
      }
      const result = await api.post('/advanced-filter', body)
      setData(result)
    } catch (e) {
      setError(e?.message || 'Advanced filter failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Section title="Advanced Filter">
      <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="Skills (comma-separated)" className="border rounded px-3 py-2 bg-transparent" />
        <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" className="border rounded px-3 py-2 bg-transparent" />
        <input type="number" value={experience} onChange={e => setExperience(Number(e.target.value))} placeholder="Experience" className="border rounded px-3 py-2 bg-transparent" />
        <input type="number" value={budget} onChange={e => setBudget(Number(e.target.value))} placeholder="Budget" className="border rounded px-3 py-2 bg-transparent" />
        <input type="number" step="0.1" value={rating} onChange={e => setRating(Number(e.target.value))} placeholder="Rating" className="border rounded px-3 py-2 bg-transparent" />
        <select value={availability} onChange={e => setAvailability(e.target.value)} className="border rounded px-3 py-2 bg-transparent">
          <option value="immediate">immediate</option>
          <option value="standard">standard</option>
          <option value="">any</option>
        </select>
        <select value={vendorType} onChange={e => setVendorType(e.target.value)} className="border rounded px-3 py-2 bg-transparent">
          <option value="individual">Individual</option>
          <option value="agency">Agency</option>
          <option value="startup">Startup</option>
        </select>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={verified} onChange={e => setVerified(e.target.checked)} /> Verified
        </label>
        <button onClick={onSearch} disabled={loading} className="px-4 py-2 rounded bg-brand text-brand-fg disabled:opacity-60">Search</button>
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {loading && <div className="mt-2">Loading...</div>}
      {data && (
        <div className="mt-3">
          <List items={data?.vendors || data?.data?.vendors || []} render={(item, idx) => (
            <VendorCard key={idx} vendor={item.vendor || item} meta={item} />
          )} />
        </div>
      )}
    </Section>
  )
}


