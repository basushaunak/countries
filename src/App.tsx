import { useState, useRef, useEffect } from "react";
import "./App.css";
import type { Country } from "./config";
import Countries from "./components/Countries";
import allCountries from "./countries.json";
// import { fetchCountrySummary } from "./utils";

function App() {
  const [countries, setCountries] = useState(allCountries);
  // fetchCountrySummary(countries[0].name).then(res=>console.log(res.extract));
  return (
    <>
    <Countries countries={countries}/>
    </>
  );
}
export default App;
