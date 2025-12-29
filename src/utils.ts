import type { Country } from "./config";
import { DB_NAME, STORE_NAME, DB_VERSION } from "./config";
export function getCountries(): Country[] {
  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onerror = (event) => {
    console.error("An error occurred with IndexedDB");
    console.error(event);
  };
  request.onupgradeneeded = () => {
    const db = request.result;
    const store = db.createObjectStore(STORE_NAME, { keyPath: "name" });
    store.createIndex("continent", ["continent"], { unique: false });
  };
  request.onsuccess = () => {
    const db = request.result;
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    let temp = store.getAll();
    let countries: Country[];
    temp.onsuccess = () => {
      countries = temp.result;
      if (countries) {
        return countries;
      }
    };
  };
}

async function readCountries() {
  let result = await fetch("/data/countries.json");
  let ctry = await result.json();
  return ctry;
}
export async function fetchCountrySummary(countryName: string) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    countryName
  )}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Wikipedia data");

  return res.json();
}
