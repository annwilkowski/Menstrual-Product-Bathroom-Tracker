// DispenserCard.jsx - displays one dispenser card

import { Clock3, LocateFixed, MapPin, Navigation } from 'lucide-react';
import ProductCount from './ProductCount.jsx';
import { count, formatTime } from '../utils/inventory.js';
import { distanceLabel } from '../utils/distance.js';

// One card for one dispenser record from FastAPI.
export default function DispenserCard({ item, distance, selected, onSelect}) {
  // check whether products are available
  const pad = count(item.pad_count);
  const tampon = count(item.tampon_count);
  const available = (pad ?? 0) + (tampon ?? 0) > 0;

  return (
    <article 
      className={`dispenser-card ${selected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="card-head">
        <div className="building-icon"><MapPin size={21} /></div>
        <div className="card-title">
          <h3>{item.name || `Dispenser ${item.id}`}</h3>
          <p>{item.building || 'Campus bathroom'}</p>
        </div>
        <span className={`overall ${available ? 'yes' : 'no'}`}>
          <span className="status-dot" />
          {available ? 'In stock' : 'No stock'}
        </span>
      </div>

      <div className="product-grid">
        <ProductCount title="Pads" value={item.pad_count} type="pad" />
        <ProductCount title="Tampons" value={item.tampon_count} type="tampon" />
      </div>

      <div className="card-footer">
        <span><Clock3 size={14} /> {item.measured_at ? `Updated ${formatTime(item.measured_at)}` : 'Not yet measured'} </span>
        {distance != null && (
          <span>
            <Navigation size={14} /> 
            {distanceLabel(distance)}
          </span>
        )}
      </div>
    </article>
  );
}
