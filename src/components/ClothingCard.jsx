export default function ClothingCard({ item, onDelete }) {
  return (
    <div className="clothing-card fade-in">
      <div className="card-image-container">
        <img src={item.imageUrl} alt={`${item.color} ${item.category}`} loading="lazy" />
        <button 
          className="delete-btn" 
          onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
          title="Remove item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
        </button>
      </div>
      <div className="card-info">
        <h3 className="card-title">{item.color} {item.category}</h3>
        <span className="card-badge">{item.style}</span>
      </div>
    </div>
  );
}
