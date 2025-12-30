import "../styles/Filter.css";
interface FilterProps{
  onChange: (cont:string)=>void,
  value:string,
}
export default function Filter({onChange,value}:FilterProps) {
  return (
    <div className="filter-box">
      <p>Select Continent</p>
      <select id="filter" onChange={(e)=>onChange(e.target.value)} value={value}>
        <option value="africa">Africa</option>
        <option value="asia">Asia</option>
        <option value="europe">Europe</option>
        <option value="northamerica">North America</option>
        <option value="southamerica">South America</option>
        <option value="observer">Observer</option>
        <option value="oceania">Oceania</option>
        <option value="all">All</option>
      </select>
      {/* <button>Go!</button> */}
    </div>
  );
}
