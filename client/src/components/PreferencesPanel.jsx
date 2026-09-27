const themes = [
  ['light', 'Light', 'Warm paper and green accents'],
  ['dark', 'Dark', 'Low-light reading environment'],
  ['contrast', 'Contrast', 'Sharper borders and clearer text'],
]

const fonts = [
  ['editorial', 'Editorial', 'Playfair headings with a calm sans-serif body'],
  ['modern', 'Modern', 'Clean sans-serif typography for quick scanning'],
  ['mono', 'Technical', 'Monospaced details with a sharper workspace feel'],
]

export default function PreferencesPanel({ preferences, onChange, onClose }) {
  return <div className="preferences-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <aside className="preferences-panel" role="dialog" aria-modal="true" aria-labelledby="preferences-title">
      <div className="preferences-head"><div><span className="eyebrow">Workspace settings</span><h2 id="preferences-title">Preferences</h2></div><button className="panel-close" type="button" onClick={onClose} aria-label="Close preferences">×</button></div>
      <section className="preference-section"><span className="preference-label">Appearance</span><div className="theme-options">{themes.map(([value, label, description]) => <button type="button" className={`theme-option ${preferences.theme === value ? 'selected' : ''}`} key={value} onClick={() => onChange({ theme: value })}><span className={`theme-swatch ${value}`} /><span><strong>{label}</strong><small>{description}</small></span><span className="preference-check">{preferences.theme === value ? '✓' : ''}</span></button>)}</div></section>
      <section className="preference-section"><span className="preference-label">Reading density</span><div className="segmented-control"><button type="button" className={preferences.density === 'comfortable' ? 'selected' : ''} onClick={() => onChange({ density: 'comfortable' })}>Comfortable</button><button type="button" className={preferences.density === 'compact' ? 'selected' : ''} onClick={() => onChange({ density: 'compact' })}>Compact</button></div></section>
      <section className="preference-section"><span className="preference-label">Font style</span><div className="theme-options">{fonts.map(([value, label, description]) => <button type="button" className={`theme-option font-preview-${value} ${preferences.font === value ? 'selected' : ''}`} key={value} onClick={() => onChange({ font: value })}><span><strong>{label}</strong><small>{description}</small></span><span className="preference-check">{preferences.font === value ? '✓' : ''}</span></button>)}</div></section>
      <section className="preference-section preference-toggle"><div><span className="preference-label">Reduced motion</span><small>Use calmer transitions throughout the workspace.</small></div><button type="button" className={`toggle ${preferences.reducedMotion ? 'on' : ''}`} role="switch" aria-checked={preferences.reducedMotion} onClick={() => onChange({ reducedMotion: !preferences.reducedMotion })}><span /></button></section>
      <div className="preferences-foot"><span>Changes are saved automatically</span><button className="primary-button" type="button" onClick={onClose}>Done</button></div>
    </aside>
  </div>
}
