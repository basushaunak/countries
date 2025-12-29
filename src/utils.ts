import type { Country } from "./config";
import { DB_NAME, STORE_NAME, DB_VERSION } from "./config";

export function readCountriesDB(): Promise<Country[]> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error("IndexedDB error", event);
      reject("Failed to open DB");
    };

    request.onupgradeneeded = () => {
      const db = request.result;
      const store = db.createObjectStore(STORE_NAME, { keyPath: "name" });
      store.createIndex("continent", ["continent"], { unique: false });
    };

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        // Resolve the promise with the data
        resolve(getAllRequest.result || []);
      };

      getAllRequest.onerror = () => reject("Failed to get data");
    };
  });
}

async function readCountries(): Promise<Country[]> {
  try {
    const response = await fetch("/data/countries.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 3. Type the JSON result
    const data: Country[] = await response.json();
    return data;
  } catch (err) {
    // TypeScript tip: 'err' is 'unknown' by default in catch blocks
    const message = err instanceof Error ? err.message : "Unknown error";
    throw new Error(`Failed to load countries: ${message}`);
  }
}

function saveCountriesDB(countries: Country[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      countries.forEach((country) => store.put(country));

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject("Failed to save countries");
    };
  });
}

export async function getCountriesData(): Promise<Country[]> {
  try {
    // 1. Try to get data from IndexedDB
    let countries = await readCountriesDB();

    // 2. Check if DB is empty
    if (countries.length === 0) {
      console.log("DB is empty. Fetching from JSON...");
      
      // 3. Fetch from JSON
      countries = await readCountries();

      // 4. Seed the database so next time it's available locally
      await saveCountriesDB(countries);
      console.log("IndexedDB seeded successfully.");
    } else {
      console.log("Data loaded from IndexedDB.");
    }

    return countries;
  } catch (error) {
    console.error("Error in getCountriesData:", error);
    return []; // Return empty array as fallback
  }
}








export async function fetchCountrySummary(countryName: string) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    countryName
  )}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Wikipedia data");

  return res.json();
}
