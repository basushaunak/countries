import "../styles/Card.css";
import type { Country } from "../config";

type cardProps = { country: Country };

export default function Card({ country }: cardProps ) {
  const imageUrl = country.countryImage
    ? URL.createObjectURL(country.countryImage)
    : undefined;
 // const imageUrl = "#";
  return (
    <div className="card">
      <div className="div-card-image">
        <img className="card-image" src={imageUrl} alt="" />
      </div>
      <div className="details">
        <div className="details-row">
          <h2 className="country-name">{country.name} <em>({country.continent})</em></h2>
          <p className="country-flag">{country.countryFlag}</p>
        </div>
        <div className="details-row">
          <p className="country-details details-prompt">Capital:</p>
          <p className="country-details">{country.capital}</p>
        </div>
        <div className="details-row">
          <p className="country-details details-prompt">Estimated Population:</p>
          <p className="country-details">{country.population}</p>
        </div>
        <div className="details-row">
          <p className="country-details details-prompt">Ex Colony of:</p>
          <p className="country-details">{country.formerColonialPower}</p>
        </div>
        <div className="details-row">
          <p className="country-details details-prompt">Independence/Formation:</p>
          <p className="country-details">{country.independenceOrFormation}</p>
        </div>
        <div className="details-row">
          <p className="country-details details-prompt">ISD Code:</p>
          <p className="country-details">{country.isd_code}</p>
        </div>
        <div className="details-row">
          <p className="country-details details-prompt">ICANN TLD:</p>
          <p className="country-details">{country.cctld}</p>
        </div>
        <p className="country-description">{country.countryDescription?country.countryDescription:
          `Details of "${country.name}" will be fetched from Wikipedia page soon`}          
          <a href="#">...</a>
        </p>
      </div>
    </div>
  );
}
