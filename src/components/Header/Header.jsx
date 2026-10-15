import { ClipboardList, Drill, Search } from 'lucide-react'
import './Header.css'

export function Header({ activeView, requestCount, onViewChange }) {
  return (
    <header className="site-header">
      <a className="site-header__brand" href="#top" onClick={() => onViewChange('browse')}>
        <span className="site-header__mark"><Drill aria-hidden="true" size={20} strokeWidth={2.2} /></span>
        <span>tool<span>share</span></span>
      </a>

      <nav className="site-header__nav" aria-label="Main navigation">
        <button
          aria-pressed={activeView === 'browse'}
          className={`site-header__nav-button ${activeView === 'browse' ? 'site-header__nav-button--active' : ''}`}
          onClick={() => onViewChange('browse')}
          type="button"
        >
          <Search aria-hidden="true" size={17} />
          <span>Find tools</span>
        </button>
        <button
          aria-pressed={activeView === 'requests'}
          className={`site-header__nav-button ${activeView === 'requests' ? 'site-header__nav-button--active' : ''}`}
          onClick={() => onViewChange('requests')}
          type="button"
        >
          <ClipboardList aria-hidden="true" size={17} />
          <span>My requests</span>
          <span className="site-header__count">{requestCount}</span>
        </button>
      </nav>
    </header>
  )
}
