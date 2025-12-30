import { useState, useEffect } from "react";
import "./App.css";
import type { Country } from "./config";
import Countries from "./components/Countries";
import Filter from "./components/Filter";
import { getCountries} from "./utils";

function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [continent, setContinent]=useState("observer");
  // fetchCountrySummary(countries[0].name).then(res=>console.log(res.extract));
  function changeContinent(cont:string):void{
    setContinent(cont);
  }
  useEffect(()=>{
    (async ()=>{
      const cntryAll = await getCountries(continent);
      setCountries(cntryAll);
    })()
  },[continent])
  return (
    <>
      <Filter onChange={changeContinent} value={continent}/>
      <Countries countries={countries} />
    </>
  );
}
export default App;
