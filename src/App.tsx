import { useState, useRef, useEffect } from "react";
import "./App.css";
import type { Country } from "./config";
import Countries from "./components/Countries";
import allCountries from "./countries.json";
import { fetchCountrySummary } from "./utils";
import { fetchCountrySummary } from "./utils";

function App() {
  const [countries, setCountries] = useState(allCountries);
  // fetchCountrySummary(countries[0].name).then(res=>console.log(res.extract));
  useEffect(() => {
    async function populateDescriptions() {
      const updatedCountries = await Promise.all(
        countries.map(async (cntry) => {
          if (cntry.countryDescription) {
            return cntry;
          } else {
            const res = await fetchCountrySummary(cntry.name);
            return {
              ...cntry,
              countryDescription: res.extract,
            };
          }
        })
      );

      setCountries(updatedCountries);
    }

    populateDescriptions();
  }, []);

  return (
    <>
      <Countries countries={countries} />
    </>
  );
}
export default App;
