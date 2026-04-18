import React from 'react'

function Section({ title, children }) {
  return (
    <div className="border border-[var(--border)] rounded-lg p-4 mb-4 bg-[var(--card)]">
      <h2 className="m-0 mb-3 text-lg font-semibold">{title}</h2>
      {children}
    </div>
  )
}

export default Section
