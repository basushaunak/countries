export default function Filter() {
  return (
    <div className="filter-box">
      <p>Select Continent</p>
      <select>
        <option value="africa">Africa</option>
        <option value="asia">Asia</option>
        <option value="europe">Europe</option>
        <option value="north-america">North America</option>
        <option value="south-america">South America</option>
        <option value="oceania">Oceanea</option>
      </select>
      <button>Go!</button>
    </div>
  );
}
