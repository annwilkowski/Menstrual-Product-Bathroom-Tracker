// App.jsx - coordinates the application

// Main page: loads inventory, handles location, search, and filtering.
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Accessibility, ArrowDownUp, Droplets, LocateFixed, MapPin,
  Package, RefreshCw, Search, SlidersHorizontal, WifiOff, X
} from 'lucide-react';
import DispenserCard from './components/DispenserCard.jsx';
import DispenserMap from './components/DispenserMap.jsx';
import { getAllDispensers } from './services/api.js';
import { distanceMeters } from './utils/distance.js';
import { count } from './utils/inventory.js';

export default function App() {
  // to remember application state
  const [dispensers, setDispensers] = useState([]);       // inventory records from FastAPI
  const [position, setPosition] = useState(null);         // user's latitude and longitude
  const [locationError, setLocationError] = useState(''); // GPS error message
  const [loading, setLoading] = useState(true);           // whether the initial inventory request is loading
  const [refreshing, setRefreshing] = useState(false);    // whether a manual refresh is in progress
  const [error, setError] = useState('');                 // inventory request error message
  const [updated, setUpdated] = useState(null);           // time of the last successful inventory fetch
  const [query, setQuery] = useState('');                 // search text
  const [filter, setFilter] = useState('all');            // selected inventory filter
  const [sort, setSort] = useState('name');               // selected sorting method
  const [selectedId, setSelectedId] = useState(null);     // select dispenser for map

  const load = useCallback(async (initial = false) => {
    if (!initial) setRefreshing(true);
    try {
      const list = await getAllDispensers();
      setDispensers(list); setError(''); setUpdated(new Date());
    } catch (e) { setError(e.message || 'Unable to load dispenser inventory.'); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  // Run load immediately after first render
  useEffect(() => { load(true); }, [load]); 
  
  // Ask the browser for the user's location
  const findNearby = () => {
    if (!navigator.geolocation) { // check if location services are supported
      setLocationError('Your browser does not support location services.'); 
      return; 
    }
    setLocationError('');
    navigator.geolocation.getCurrentPosition(async ({ coords }) => { // get location
      const p = { 
        latitude: coords.latitude, 
        longitude: coords.longitude 
      };
      setPosition(p); setSort('nearest'); setSelectedId(null);
      console.log('Location found:', p); // TESTING
    }, 
    err => {
      console.error('Geolocation error:', err.code, err.message);
      if (err.code === 1) {
        setLocationError('Location permission was denied.');
      } else if (err.code === 2) {
        setLocationError('Your browser could not determine your location.');
      } else if (err.code === 3) {
        setLocationError('Location request timed out. Try again.');
      } else {
        setLocationError('Unknown location error.');
      }
    }, 
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
  };

  // Calculate distance from the user to each dispenser
  const enriched = useMemo(() => dispensers.map(d => ({
    ...d,
    distance: position && d.latitude != null && d.longitude != null 
    && Number.isFinite(Number(d.latitude)) && Number.isFinite(Number(d.longitude))
      ? distanceMeters(position, {
          latitude: Number(d.latitude),
          longitude: Number(d.longitude)
        })
      : null
  })), [dispensers, position]);

  // Filter and sort the dispensers
  const shown = useMemo(() => enriched
    .filter(d => {
      const match = `${d.name || ''} ${d.building || ''}`
        .toLowerCase().includes(query.toLowerCase());

      const pads = count(d.pad_count);
      const tampons = count(d.tampon_count);

      return match && (
        filter === 'all' ||
        (filter === 'pads' && pads > 0) ||
        (filter === 'tampons' && tampons > 0) ||
        (filter === 'in-stock' && (pads > 0 || tampons > 0))
      );
    })
    .sort((a, b) =>
      sort === 'nearest' && position
        ? (a.distance ?? Infinity) - (b.distance ?? Infinity)
        : sort === 'stock'
          ? ((count(b.pad_count) || 0) + (count(b.tampon_count) || 0))
            - ((count(a.pad_count) || 0) + (count(a.tampon_count) || 0))
          : String(a.name || '').localeCompare(String(b.name || ''))
    ), [enriched, query, filter, sort, position]);

  // Count locations that have at least one product available
  const availableCount = enriched.filter(d =>
    (count(d.pad_count) || 0) + (count(d.tampon_count) || 0) > 0
  ).length;

  return (
    <div className="app-shell">
      {/* Header */}
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><Droplets size={30} /></div>
          <div>
            <strong>Flow Sense</strong>
            <span>Menstrual Product Tracker</span>
          </div>
        </div>
        <div className="header-right">
          <span className="campus-label"><MapPin size={15} /> UIUC Campus</span>
        </div>
      </header>

      <main className="main">
        {/* Page Intro */}
        <div className="page-intro">
          <div>
            <h1>Find menstrual products on campus</h1>
            <p>Check pad and tampon availability in campus bathrooms before you go.</p>
          </div>

          <button className="primary-button" onClick={findNearby}>
            <LocateFixed size={18} /> Find dispensers near me
          </button>
        </div>

        <div className="directory-layout">
          {/* Inventory */}
          <section className="inventory-section">
            <div className="section-heading">
              <div>
                <h2>Available dispensers</h2>
              </div>
              <button className="refresh-button" onClick={() => load()} disabled={refreshing}>
                <RefreshCw size={16} className={refreshing ? 'spinning' : ''} /> Refresh
              </button>
            </div>

            {locationError && (
              <div className="notice">
                <MapPin size={17} /> {locationError}
                <button aria-label="Dismiss location message" onClick={() => setLocationError('')}>
                  <X size={16} />
                </button>
              </div>
            )}

            {error && (
              <div className="notice error">
                <WifiOff size={18} />
                <span>
                  <b>Can't connect to FastAPI.</b> {error}
                  {dispensers.length > 0 && 'Showing the last successfully loaded data.'}
                </span>
              </div>
            )}

            {/* Search and filters */}
            <div className="toolbar">
              <label className="search-box">
                <Search size={18} />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search bathrooms or buildings..."
                  aria-label="Search dispensers"
                />
                {query && (
                  <button aria-label="Clear search" onClick={() => setQuery('')}>
                    <X size={16} />
                  </button>
                )}
              </label>

              <div className="toolbar-right">
                <label className="select-wrap">
                  <SlidersHorizontal size={16} />
                  <select aria-label="Filter inventory" value={filter} onChange={e => setFilter(e.target.value)}>
                    <option value="all">All products</option>
                    <option value="in-stock">Any in stock</option>
                    <option value="pads">Pads available</option>
                    <option value="tampons">Tampons available</option>
                  </select>
                </label>

                <label className="select-wrap">
                  <ArrowDownUp size={16} />
                  <select aria-label="Sort dispensers" value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="name">Name</option>
                    <option value="nearest" disabled={!position}>Nearest first</option>
                    <option value="stock">Most stocked</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Results */}
            <div className="results-line">
              <span>{shown.length} {shown.length === 1 ? 'location' : 'locations'} found</span>
              <span>
                {updated
                  ? `Last synced ${updated.toLocaleTimeString([], {
                      hour: 'numeric', minute: '2-digit', second: '2-digit'
                    })}`
                  : 'Not synced yet'}
              </span>
            </div>

            {loading ? (
              <div className="empty-state">Loading campus dispensers…</div>
            ) : shown.length ? (
              <div className="cards">
                {shown.map(d => (
                  <DispenserCard
                    key={d.id}
                    item={d}
                    distance={d.distance}
                    selected={String(selectedId) === String(d.id)}
                    onSelect={() => setSelectedId(d.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Package size={32} />
                <h3>No dispensers found</h3>
                <p>{error ? 'Check your FastAPI server and refresh.' : 'Try a different search or filter.'}</p>
              </div>
            )}
          </section>

          <section className="map-panel">
            <DispenserMap
              dispensers={shown}
              position={position}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </section>

        </div> {/* End directory layout */}

        <footer>
          <div className="footer-brand"><Droplets size={17} /> Flow Sense</div>
          <span>Built for ECE 445 Senior Design · University of Illinois Urbana-Champaign</span>
          <span><Accessibility size={15} /> Accessible menstrual product information for everyone</span>
        </footer>
      </main>
    </div>
  );
}
