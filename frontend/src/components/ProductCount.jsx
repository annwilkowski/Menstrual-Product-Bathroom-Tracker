// ProductCount.jsx - Displays one product count
// Component shows up as <Product Count title="Pads" value={5} type="pad" /> 

import { Package } from 'lucide-react';
import { count, status, label } from '../utils/inventory.js';

// A small reusable display for either pads or tampons.
export default function ProductCount({ title, value, type }) {
  const n = count(value);
  const s = status(n);

  return (
    <div className="product-count">
      <div className={`product-icon ${type}`}>
        <Package size={18} />
      </div>
      <div>
        <div className={`product-label ${type}`}>{title}</div>
        <div className="product-value">{n ?? '—'} <span>remaining</span></div>
      </div>
      {/* <span className={`stock-pill ${s}`}>{label(s)}</span> */}
    </div>
  );
}
