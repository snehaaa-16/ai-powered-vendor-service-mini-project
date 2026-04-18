import React, { useMemo, useState } from 'react'
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
        </div>
      )}
    </div>
  )
}

export default function SmartSearch() {
  const [requirement, setRequirement] = useState('I need a React developer to build an e-commerce website with payment integration. Budget is 50k and I need it completed in 2 months. Prefer someone in Mumbai with 3+ years experience.')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const onSearch = async () => {
    setLoading(true)
    setError(null)
    try {
      const body = { requirement }
      const result = await api.post('/smart-search', body)
      // result is already the parsed JSON response { success, vendors, analysis, ... }
      setData(result)
    } catch (e) {
      setError(e?.message || 'Smart search failed')
    } finally {
      setLoading(false)
    }
  }

  const analysis = data?.analysis || data?.aiAnalysis
  const vendors = useMemo(() => data?.vendors || [], [data])

  return (
    <Section title="AI Smart Search">
      <div className="flex gap-2">
        <textarea value={requirement} onChange={e => setRequirement(e.target.value)} rows={4} className="flex-1 border rounded px-3 py-2 bg-transparent" />
      </div>
      <div className="mt-2">
        <button onClick={onSearch} disabled={loading} className="px-4 py-2 rounded bg-brand text-brand-fg disabled:opacity-60">Analyze & Search</button>
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {loading && <div className="mt-2">Analyzing...</div>}
      {analysis && (
        <div className="mt-3 border border-[var(--border)] rounded-lg p-3 bg-[var(--card)]">
          <div className="font-semibold mb-1">AI Analysis</div>
          <div className="flex gap-2 flex-wrap">
            {(analysis.requiredSkills || []).map(s => (
              <span key={s} className="border border-[var(--border)] rounded-full px-2 py-0.5 text-xs">{s}</span>
            ))}
          </div>
          <div className="mt-2 grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
            <div>Location: {analysis.location || '-'}</div>
            <div>Experience: {analysis.experience || '-'}</div>
            <div>Budget: {analysis.budget || '-'}</div>
            <div>Project: {analysis.projectType || '-'}</div>
            <div>Complexity: {analysis.complexity || '-'}</div>
            <div>Timeline: {analysis.timeline || '-'}</div>
          </div>
        </div>
      )}
      {vendors && vendors.length > 0 && (
        <div className="mt-3">
          <List items={vendors} render={(item, idx) => (
            <VendorCard key={idx} vendor={item.vendor || item} meta={item} />
          )} />
        </div>
      )}
    </Section>
  )
}


