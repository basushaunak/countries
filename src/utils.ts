import type { Country } from "./config";
import { DB_NAME, STORE_NAME, DB_VERSION } from "./config";
type WikiSummary = {
  extract: string;
};

function readCountriesDB(continent: string): Promise<Country[]> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error("IndexedDB error", event);
      reject(`Failed to open ${DB_NAME}`);
    };

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "name" });
        store.createIndex("continent", "continent", { unique: false });
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index("continent");
      let getAllRequest;
      if (continent === "all") {
        getAllRequest = store.getAll();
      } else {
        getAllRequest = index.getAll(continent);        
      }

      getAllRequest.onsuccess = () => {
        const tmpCountries = getAllRequest.result;
        db.close();
        resolve(tmpCountries || []);
      };

      getAllRequest.onerror = () => reject("Failed to get data");
    };
  });
}

async function readCountries(continent: string): Promise<Country[]> {
  try {
    const response = await fetch(`/data/${continent}.json`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Country[] = await response.json();
    return data;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    throw new Error(`Failed to load countries: ${message}`);
  }
}

function saveCountriesDB(countries: Country[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => {
      reject(`Failed to open ${DB_NAME}`);
    };
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "name" });
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      countries.forEach((country) => store.put(country));

      transaction.oncomplete = () => {
        db.close();
        resolve();
      };
      transaction.onerror = () => reject("Failed to save countries");
      transaction.onabort = () => reject("Transaction aborted");
    };
  });
}

export async function getCountries(continent: string): Promise<Country[]> {
  try {
    let countries = await readCountriesDB(continent);

    if (countries.length === 0) {
      console.log("DB is empty. Fetching from JSON...");

      countries = await readCountries(continent);

      await saveCountriesDB(countries);
      console.log("IndexedDB seeded successfully.");
    } else {
      console.log("Data loaded from IndexedDB.");
    }
    const tmpCountriesWithInfo = await hydrateCountrySummary(countries);
    //    const tmpcountriesWithMap = await hydrateCountryMaps(tmpCountriesWithInfo);
    await saveCountriesDB(tmpCountriesWithInfo);
    return tmpCountriesWithInfo;
  } catch (error) {
    console.error("Error in getCountriesData:", error);
    return [];
  }
}

//Update brief country intro from wikipedia.

async function hydrateCountrySummary(countryList: Country[]) {
  const hydratedCountries = await Promise.all(
    countryList.map(async (country) => {
      if (country.countryDescription) {
        return country;
      }
      try {
        const response = await fetchCountrySummary(country.name);
        return { ...country, countryDescription: response.extract };
      } catch (err) {
        console.warn(`Failed to hydrate ${country.name}`, err);
        return country;
      }
    })
  );
  return hydratedCountries;
}

async function fetchCountrySummary(countryName: string): Promise<WikiSummary> {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    countryName
  )}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch Wikipedia data");
  }

  return res.json();
}

// Maps check and understand before incorporating.

async function hydrateCountryMaps(countries: Country[]): Promise<Country[]> {
  return Promise.all(
    countries.map(async (country) => {
      if (country.countryImage) return country;

      const blob = await fetchCountryMap(country.name);

      return {
        ...country,
        countryImage: blob,
      };
    })
  );
}

function getCountryMapUrl(countryName: string): string {
  const encoded = encodeURIComponent(countryName);

  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encoded}%20location%20map.svg`;
}

async function fetchCountryMap(countryName: string): Promise<Blob | null> {
  const url = getCountryMapUrl(countryName);

  const res = await fetch(url);

  if (!res.ok) {
    console.warn(`Failed to fetch map for ${countryName}`);
    return null;
  }

  return await res.blob();
}
