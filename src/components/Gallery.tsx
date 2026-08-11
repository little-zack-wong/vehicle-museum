import { CATEGORIES, VEHICLES, type Vehicle } from '../data/vehicles'

interface GalleryProps {
  onSelect: (vehicle: Vehicle) => void
}

/**
 * 首页：按分类分组的大卡片列表，3 岁孩子也能轻松点。
 */
export function Gallery({ onSelect }: GalleryProps) {
  return (
    <div className="gallery">
      <header className="gallery-header">
        <h1>
          <span className="header-emoji" aria-hidden="true">
            🚗
          </span>
          汽车小博物馆
        </h1>
        <p>点一辆车，转一转，看一看</p>
      </header>

      {CATEGORIES.map((cat) => {
        const items = VEHICLES.filter((v) => v.category === cat.id)
        if (items.length === 0) return null
        return (
          <section className="gallery-section" key={cat.id}>
            <h2 className="section-title">
              <span aria-hidden="true">{cat.emoji}</span> {cat.label}
            </h2>
            <div className="card-grid">
              {items.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className="vehicle-card"
                  style={{ '--card-color': v.color } as React.CSSProperties}
                  onClick={() => onSelect(v)}
                  aria-label={`看看${v.name}`}
                >
                  <span className="vehicle-card-emoji" aria-hidden="true">
                    {v.emoji}
                  </span>
                  <span className="vehicle-card-name">{v.name}</span>
                  <span className="vehicle-card-english">{v.english}</span>
                </button>
              ))}
            </div>
          </section>
        )
      })}

      <footer className="gallery-footer">和爸爸妈妈一起看 🧡</footer>
    </div>
  )
}
