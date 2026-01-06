import { useEffect, useRef } from "react";
import CountryListItem from "./CountryListItem";
import { Country } from "../types";

type SelectedCountriesProps = {
  countries: Country[];
  onRemove: (country: Country) => void;
  error: string | null;
};

const SelectedCountries = ({
  countries,
  onRemove,
  error,
}: SelectedCountriesProps) => {
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) {
      return;
    }
    list.scrollTop = list.scrollHeight;
  }, [countries.length]);

  return (
    <div className="panel-content">
      <h4>Selected Countries</h4>
      {error && <div className="text-danger">{error}</div>}
      {countries.length === 0 && (
        <div className="status">No countries selected yet.</div>
      )}
      <ul className="list-group pr-2 selected-list" ref={listRef}>
        {countries.map((country) => (
          <CountryListItem
            key={country.code}
            country={country}
            actionLabel="x"
            buttonVariant="danger"
            buttonTitle="Remove from selected countries"
            onAction={onRemove}
          />
        ))}
      </ul>
    </div>
  );
};

export default SelectedCountries;
