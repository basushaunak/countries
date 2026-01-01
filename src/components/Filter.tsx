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
        <option value="Africa">Africa</option>
        <option value="Asia">Asia</option>
        <option value="Europe">Europe</option>
        <option value="North America">North America</option>
        <option value="South America">South America</option>
        <option value="Observer">Observer</option>
        <option value="Oceania">Oceania</option>
        <option value="All">All</option>
      </select>
      {/* <button>Go!</button> */}
    </div>
  );
}
