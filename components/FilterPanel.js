export default function FilterPanel({ filters, setFilters, options }) {
  return (
    <div style={{display: "flex", gap: "1rem", marginBottom: "1rem"}}>
      {Object.keys(options).map(key =>
        <select
          key={key}
          value={filters[key] || ""}
          onChange={e => setFilters({...filters, [key]: e.target.value})}
        >
          {options[key].map(opt =>
            <option key={opt} value={opt}>{opt || `All ${key}`}</option>
          )}
        </select>
      )}
    </div>
  );
}
