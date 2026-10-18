import { useState } from 'react'
import { CategoryFilter } from './components/CategoryFilter/CategoryFilter'
import { Header } from './components/Header/Header'
import { RequestDialog } from './components/RequestDialog/RequestDialog'
import { RequestList } from './components/RequestList/RequestList'
import { ToolCard } from './components/ToolCard/ToolCard'
import { categories, tools } from './data/tools'
import { readRequests, writeRequests } from './utils/requests'
import './App.css'

function App() {
  const [activeView, setActiveView] = useState('browse')
  const [activeCategory, setActiveCategory] = useState('All tools')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortMode, setSortMode] = useState('recommended')
  const [requests, setRequests] = useState(readRequests)
  const [selectedTool, setSelectedTool] = useState(null)
  const [notice, setNotice] = useState('')

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredTools = tools.filter((tool) => {
    const matchesCategory = activeCategory === 'All tools' || tool.category === activeCategory
    const searchableText = `${tool.name} ${tool.category} ${tool.description} ${tool.neighborhood}`.toLowerCase()

    return matchesCategory && searchableText.includes(normalizedQuery)
  })
  const visibleTools = [...filteredTools].sort((firstTool, secondTool) => {
    if (sortMode === 'price-low') {
      return firstTool.dailyRate - secondTool.dailyRate || firstTool.name.localeCompare(secondTool.name)
    }

    if (sortMode === 'price-high') {
      return secondTool.dailyRate - firstTool.dailyRate || firstTool.name.localeCompare(secondTool.name)
    }

    return 0
  })

  function handleCreateRequest(requestDetails) {
    const nextRequests = [
      {
        ...requestDetails,
        id: globalThis.crypto?.randomUUID?.() ?? `request-${Date.now()}`,
        status: 'Pending',
        createdAt: new Date().toISOString()
      },
      ...requests
    ]

    setRequests(nextRequests)
    const wasSaved = writeRequests(nextRequests)
    setSelectedTool(null)
    setActiveView('requests')
    setNotice(wasSaved ? 'Request sent to the lender.' : 'Request added for this session only.')
    window.setTimeout(() => setNotice(''), 3200)
  }

  function handleCancelRequest(requestId) {
    const nextRequests = requests.filter((request) => request.id !== requestId)
    setRequests(nextRequests)
    writeRequests(nextRequests)
  }

  return (
    <div className="app-shell">
      <Header
        activeView={activeView}
        requestCount={requests.length}
        onViewChange={setActiveView}
      />

      <main className="workspace">
        <div className="workspace__heading">
          <div>
            <p className="workspace__eyebrow">DECATUR / NEIGHBORHOOD EXCHANGE</p>
            <h1>{activeView === 'browse' ? 'Tools near you' : 'Your requests'}</h1>
            <p className="workspace__intro">
              {activeView === 'browse'
                ? 'Borrow useful gear from people nearby.'
                : 'Keep track of the tools you have requested.'}
            </p>
          </div>
          {activeView === 'browse' ? (
            <span className="workspace__count">{visibleTools.length} available</span>
          ) : null}
        </div>

        {notice ? <p className="workspace__notice" role="status">{notice}</p> : null}

        {activeView === 'browse' ? (
          <>
            <section className="catalog-controls" aria-label="Find tools">
              <label className="catalog-controls__search">
                <span className="visually-hidden">Search tools</span>
                <span className="catalog-controls__search-icon" aria-hidden="true">⌕</span>
                <input
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search drills, ladders, garden tools..."
                  type="search"
                  value={searchQuery}
                />
              </label>
              <div className="catalog-controls__filter-row">
                <CategoryFilter
                  activeCategory={activeCategory}
                  categories={categories}
                  onCategoryChange={setActiveCategory}
                />
                <label className="catalog-controls__sort">
                  <span>Sort</span>
                  <select onChange={(event) => setSortMode(event.target.value)} value={sortMode}>
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                  </select>
                </label>
              </div>
            </section>

            {visibleTools.length ? (
              <section className="tool-grid" aria-label="Available tools">
                {visibleTools.map((tool) => (
                  <ToolCard key={tool.id} onRequest={setSelectedTool} tool={tool} />
                ))}
              </section>
            ) : (
              <section className="workspace__empty">
                <h2>No tools match that search</h2>
                <p>Try another term or choose a different category.</p>
                <button
                  className="button button--quiet"
                  onClick={() => {
                    setSearchQuery('')
                    setActiveCategory('All tools')
                  }}
                  type="button"
                >
                  Clear filters
                </button>
              </section>
            )}
          </>
        ) : (
          <RequestList onCancelRequest={handleCancelRequest} requests={requests} onBrowse={() => setActiveView('browse')} />
        )}
      </main>

      <footer className="app-footer">
        <span>ToolShare</span>
        <span>Borrow local. Return in good shape.</span>
      </footer>

      {selectedTool ? (
        <RequestDialog
          onClose={() => setSelectedTool(null)}
          onSubmit={handleCreateRequest}
          tool={selectedTool}
        />
      ) : null}
    </div>
  )
}

export default App
