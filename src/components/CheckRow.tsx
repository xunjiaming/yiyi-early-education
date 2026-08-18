import { Check } from 'lucide-react'

export interface ToggledRow {
  id: string
  key: string
  title: string
  how?: string
  note?: string
}

export function CheckRow({
  done,
  onToggle,
  itemKey,
  title,
  how,
  note,
  accent = '#4f8ef7'
}: {
  done: boolean
  onToggle: (key: string) => void
  itemKey: string
  title: string
  how?: string
  note?: string
  accent?: string
}) {
  return (
    <div
      className={`check-row${done ? ' done' : ''}`}
      onClick={() => onToggle(itemKey)}
      style={{ cursor: 'pointer' }}
    >
      <span
        className="check-box"
        style={done ? { background: accent, borderColor: accent } : undefined}
      >
        {done && <Check size={14} strokeWidth={3} />}
      </span>
      <div className="row-main">
        <p className="row-text">{title}</p>
        {how && <p className="row-how">{how}</p>}
        {note && <span className="row-note">{note}</span>}
      </div>
    </div>
  )
}
