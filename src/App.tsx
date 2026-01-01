import { useState, useEffect } from "react";
import "./App.css";
import type { Country } from "./config";
import Countries from "./components/Countries";
import Filter from "./components/Filter";
import { getCountries } from "./utils";

function App() {
  const [continent, setContinent] = useState<string>("");
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  function changeContinent(cont: string): void {
    setContinent(cont);
  }
  useEffect(() => {
    let mounted = true;
    (async () => {
      const cntryAll = await getCountries();
      if (mounted) {
        setAllCountries(cntryAll);
        setContinent("Observer");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <>
      <Filter onChange={changeContinent} value={continent} />
      <Countries countries={allCountries} continent={continent} />
    </>
  );
}
export default App;
