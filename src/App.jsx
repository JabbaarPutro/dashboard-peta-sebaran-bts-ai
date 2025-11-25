import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, GeoJSON, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './index.css';

const config = {
  title: 'Dashboard Sebaran BTS',
  mapTitle: 'Peta Sebaran BTS Nasional',
  statLabels: { total: 'Total BTS', status1: 'On Air', status2: 'Dalam Pembangunan' },
  statusOptions: [
    { value: 'On Air', text: 'On Air' },
    { value: 'Dalam Pembangunan', text: 'Dalam Pembangunan' }
  ]
};

function getColor(d) {
  return d > 100 ? '#06417b' :
    d > 50 ? '#08519c' :
      d > 25 ? '#3182bd' :
        d > 10 ? '#6baed6' :
          d > 0 ? '#9ecae1' : '#c6dbef';
}

const CustomIcon = (status) => {
  const color = status === 'On Air' ? '#3b82f6' : '#f97316';
  return new L.DivIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="20px" height="20px"><circle cx="12" cy="12" r="10"/></svg>`,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

function App() {
  const [pointData, setPointData] = useState([]);
  const [provinceData, setProvinceData] = useState({});
  const [lastUpdated, setLastUpdated] = useState('');
  const [filters, setFilters] = useState({ jaringan: [], jenis_layanan: [] });
  const [selectedStatus, setSelectedStatus] = useState('semua');
  const [selectedJaringan, setSelectedJaringan] = useState([]);
  const [selectedLayanan, setSelectedLayanan] = useState([]);
  const [geoJson, setGeoJson] = useState(null);

  useEffect(() => {
    fetch('/api/bts')
      .then(res => res.json())
      .then(data => {
        setPointData(data.pointData);
        setProvinceData(data.provinceData);
        setLastUpdated(data.lastUpdated);
        setFilters(data.filters);
        setSelectedJaringan(data.filters.jaringan || []);
        setSelectedLayanan(data.filters.jenis_layanan || []);
      })
      .catch(err => console.error('Error fetching BTS data:', err));
    fetch('/IndonesiaProvinsi.geojson')
      .then(res => res.json())
      .then(data => setGeoJson(data))
      .catch(err => console.error('Error fetching GeoJSON:', err));
  }, []);

  const filteredPoints = pointData.filter((point) => {
    const statusMatch = selectedStatus === 'semua' || point.status === selectedStatus;
    const jaringanMatch = selectedJaringan.length === 0 || selectedJaringan.includes(point.jaringan);
    const layananMatch = selectedLayanan.length === 0 || selectedLayanan.includes(point.jenis_layanan);
    return statusMatch && jaringanMatch && layananMatch;
  });

  const totalFiltered = filteredPoints.length;
  const status1Filtered = filteredPoints.filter(p => p.status === config.statusOptions[0].value).length;
  const status2Filtered = totalFiltered - status1Filtered;

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e293b' }}>{config.title}</h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>Terakhir Diperbaharui - {lastUpdated || 'N/A'}</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <StatCard label={config.statLabels.total} value={totalFiltered} />
          <StatCard label={config.statLabels.status1} value={status1Filtered} />
          <StatCard label={config.statLabels.status2} value={status2Filtered} />
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <FilterDropdown
            label="Status"
            options={[{ value: 'semua', text: 'Semua Status' }, ...config.statusOptions]}
            value={selectedStatus}
            onChange={setSelectedStatus}
          />
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>{config.mapTitle}</h2>
          <div style={{ height: '60vh', width: '100%' }}>
            <MapContainer center={[-2.5, 117]} zoom={5} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {geoJson &&
                <GeoJSON
                  data={geoJson}
                  style={feature => ({
                    fillColor: getColor(provinceData[(feature.properties.state || "").toUpperCase()]?.total || 0),
                    weight: 1, opacity: 1, color: '#e2e8f0', fillOpacity: 0.7
                  })}
                />}
              {filteredPoints.map(point => (
                <Marker
                  key={point.id}
                  position={[point.lat, point.lon]}
                  icon={CustomIcon(point.status)}
                >
                  <Popup>
                    <div>
                      <b>{point.nama_situs}</b><br />
                      {point.kabupaten}<br />
                      Status: <span>{point.status}</span><br />
                      Jaringan: <span>{point.jaringan || 'N/A'}</span><br />
                      Layanan: <span>{point.jenis_layanan || 'N/A'}</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
      <footer style={{ marginTop: '3rem', width: '100%' }}>
        <div style={{ backgroundColor: '#fbbf24', padding: '1.5rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <p style={{ textAlign: 'left', color: '#1f2937', fontSize: '0.875rem', fontWeight: '500' }}>
              Copyright &copy; {new Date().getFullYear()} BAKTI KOMDIGI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const StatCard = ({ label, value }) => (
  <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
    <h2 style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '500' }}>{label}</h2>
    <p style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{value}</p>
  </div>
);

function FilterDropdown({ label, options, value, onChange }) {
  return (
    <div>
      <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>{label}:</label>
      <select style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: '#e2e8f0', border: 'none' }} value={value} onChange={e => onChange(e.target.value)}>
        {options.map(opt => (
          <option value={opt.value} key={opt.value}>{opt.text}</option>
        ))}
      </select>
    </div>
  );
}

export default App;