import { useEffect, useMemo, useState } from "react";
import CountryListItem from "./CountryListItem";
import { Country } from "../types";

type SearchProps = {
  query: string;
  onQueryChange: (value: string) => void;
  results: Country[];
  isLoading: boolean;
  error: string | null;
  onAdd: (country: Country) => void;
  selectedCodes: Set<string>;
};

const Search = ({
  query,
  onQueryChange,
  results,
  isLoading,
  error,
  onAdd,
  selectedCodes,
}: SearchProps) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const hasQuery = query.trim().length > 0;
  const selectedDetails = useMemo(() => {
    if (!selectedCountry) {
      return null;
    }
    return {
      name: selectedCountry.officialName ?? selectedCountry.name,
      capital: selectedCountry.capital,
      region: selectedCountry.region,
      subregion: selectedCountry.subregion,
      population: selectedCountry.population,
      languages: selectedCountry.languages?.join(", "),
      currencies: selectedCountry.currencies?.join(", "),
      area: selectedCountry.area,
    };
  }, [selectedCountry]);

  useEffect(() => {
    if (!hasQuery) {
      setSelectedCountry(null);
    }
  }, [hasQuery]);

  useEffect(() => {
    if (!selectedCountry) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedCountry(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCountry]);

  return (
    <div className="panel-content">
      <input
        type="text"
        className="search-input"
        placeholder="Start typing to search for a country."
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      {!hasQuery ? (
        <div className="status"></div>
      ) : (
        <>
          <h4>Search Results</h4>
          {isLoading && <div className="status">Loading results...</div>}
          {error && <div className="text-danger">{error}</div>}
          {!isLoading && !error && results.length === 0 && (
            <div className="status">Searching...</div>
          )}
          {!error && (
            <ul className="list-group pr-2">
              {results.map((country) => (
                <CountryListItem
                  key={country.code}
                  country={country}
                  actionLabel={
                    selectedCodes.has(country.code) ? "selected" : "+"
                  }
                  buttonVariant={
                    selectedCodes.has(country.code) ? "secondary" : "primary"
                  }
                  buttonTitle={
                    selectedCodes.has(country.code)
                      ? "Already selected"
                      : "Add to selected countries"
                  }
                  onSelect={setSelectedCountry}
                  isActive={selectedCountry?.code === country.code}
                  onAction={(item) => {
                    if (!selectedCodes.has(item.code)) {
                      onAdd(item);
                    }
                  }}
                />
              ))}
            </ul>
          )}
          {selectedDetails && (
            <div
              className="details-overlay"
              role="dialog"
              aria-modal="true"
              onClick={() => setSelectedCountry(null)}
            >
              <div
                className="details-card"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  className="details-close"
                  onClick={() => setSelectedCountry(null)}
                  aria-label="Close country details"
                >
                  ×
                </button>
                <div className="details-header">
                  <img
                    src={selectedCountry?.flagUrl}
                    alt={`${selectedCountry?.name ?? "Selected"} flag`}
                  />
                  <div>
                    <p className="details-title">{selectedDetails.name}</p>
                    {selectedCountry?.name &&
                      selectedCountry.name !== selectedDetails.name && (
                        <p className="details-subtitle">
                          {selectedCountry.name}
                        </p>
                      )}
                  </div>
                </div>
                <dl className="details-grid">
                  {selectedDetails.capital && (
                    <>
                      <dt>Capital</dt>
                      <dd>{selectedDetails.capital}</dd>
                    </>
                  )}
                  {selectedDetails.region && (
                    <>
                      <dt>Region</dt>
                      <dd>
                        {selectedDetails.region}
                        {selectedDetails.subregion
                          ? ` · ${selectedDetails.subregion}`
                          : ""}
                      </dd>
                    </>
                  )}
                  {selectedDetails.population && (
                    <>
                      <dt>Population</dt>
                      <dd>{selectedDetails.population.toLocaleString()}</dd>
                    </>
                  )}
                  {selectedDetails.area && (
                    <>
                      <dt>Area</dt>
                      <dd>{selectedDetails.area.toLocaleString()} km²</dd>
                    </>
                  )}
                  {selectedDetails.languages && (
                    <>
                      <dt>Languages</dt>
                      <dd>{selectedDetails.languages}</dd>
                    </>
                  )}
                  {selectedDetails.currencies && (
                    <>
                      <dt>Currencies</dt>
                      <dd>{selectedDetails.currencies}</dd>
                    </>
                  )}
                </dl>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
