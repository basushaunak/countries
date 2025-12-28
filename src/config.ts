export const DB_NAME = "countryDB";
export const STORE_NAME = "countries";
export const DB_VERSION = 1.0;


export interface Country  {
    "name": string,
    "capital": string,
    "population": number,
    "independenceOrFormation": string,
    "formerColonialPower": string,
    "isd_code": string,
    "cctld": string,
    "countryDescription": string,
    "countryFlag": "🇩🇿",
    "countryImage": Blob | null,
    "continent": string
  }