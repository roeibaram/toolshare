import { ArrowUpRight, MapPin } from 'lucide-react'
import './ToolCard.css'

export function ToolCard({ onRequest, tool }) {
  return (
    <article className="tool-card">
      <div className="tool-card__image-wrap">
        <img className="tool-card__image" src={tool.image} alt={tool.imageAlt} loading="lazy" />
        <span className="tool-card__category">{tool.category}</span>
      </div>
      <div className="tool-card__content">
        <div className="tool-card__heading">
          <div>
            <h2>{tool.name}</h2>
            <p className="tool-card__owner">Shared by {tool.owner}</p>
          </div>
          <p className="tool-card__rate"><strong>${tool.dailyRate}</strong><span>/ day</span></p>
        </div>
        <p className="tool-card__description">{tool.description}</p>
        <p className="tool-card__location"><MapPin aria-hidden="true" size={15} />{tool.neighborhood}, Decatur</p>
        <button className="tool-card__request" onClick={() => onRequest(tool)} type="button">
          Request to borrow <ArrowUpRight aria-hidden="true" size={16} />
        </button>
      </div>
    </article>
  )
}
