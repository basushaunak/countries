import type { Country } from "../config";
import "../styles/Countries.css";
import Card from "./Card";
interface CountriesProps {
  countries: Country[];
  continent: string;
}

export default function Countries({ countries, continent }: CountriesProps) {
  const filteredCountries =
    continent === "All"
      ? countries
      : countries.filter((country) => country.continent === continent);
  return (
    <div className="countries">
      {filteredCountries.map((country: Country) => {
        return <Card country={country} key={country.name} />;
      })}
    </div>
  );
}
