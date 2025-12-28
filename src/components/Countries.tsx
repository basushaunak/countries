import type { Country } from "../config";
import "../styles/Countries.css";
import Card from "./Card";

interface CountriesProps {
  countries: Country[];
}
export default function Countries({countries}:CountriesProps) {
  return (
    <div className="countries">
      {countries.map((country:Country) => {
        return <Card country={country} />;
      })}
    </div>
  );
}
