import { useState, useEffect } from "react";
import "./App.css";
import type { Country } from "./config";
import Countries from "./components/Countries";
import Filter from "./components/Filter";
import { getCountries} from "./utils";

function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  // fetchCountrySummary(countries[0].name).then(res=>console.log(res.extract));
  useEffect(()=>{
    (async ()=>{
      const cntryAll = await getCountries();
      setCountries(cntryAll);
    })()
  },[])
  return (
    <>
      <Filter />
      <Countries countries={countries} />
    </>
  );
}
export default App;
