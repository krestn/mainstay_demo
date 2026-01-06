import { useEffect, useMemo, useState } from "react";
import Search from "./components/Search";
import SelectedCountries from "./components/SelectedCountries";
import {
  fetchSelectedCountries,
  removeSelectedCountry,
  saveSelectedCountry,
  searchCountries,
} from "./api";
import { Country } from "./types";

const App = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Country[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);
  const [selectedError, setSelectedError] = useState<string | null>(null);

  const selectedCodes = useMemo(
    () => new Set(selectedCountries.map((country) => country.code)),
    [selectedCountries]
  );

  useEffect(() => {
    let isActive = true;
    const loadSelected = async () => {
      setSelectedError(null);
      try {
        const data = await fetchSelectedCountries();
        if (isActive) {
          setSelectedCountries(data);
        }
      } catch (error) {
        if (isActive) {
          setSelectedError(
            error instanceof Error
              ? error.message
              : "Failed to load selected countries."
          );
        }
      }
    };
    loadSelected();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length === 0) {
      setSearchResults([]);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const normalized = await searchCountries(
          trimmedQuery,
          controller.signal
        );
        setSearchResults(normalized);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setSearchError(
          error instanceof Error ? error.message : "Search failed."
        );
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  const handleAddCountry = async (country: Country) => {
    if (selectedCodes.has(country.code)) {
      return;
    }
    setSelectedError(null);
    try {
      const saved = await saveSelectedCountry(country);
      setSelectedCountries((previous) => [...previous, saved]);
    } catch (error) {
      setSelectedError(
        error instanceof Error
          ? error.message
          : "Failed to save selected country."
      );
    }
  };

  const handleRemoveCountry = async (country: Country) => {
    setSelectedError(null);
    try {
      await removeSelectedCountry(country);
      setSelectedCountries((previous) =>
        previous.filter((item) => item.code !== country.code)
      );
    } catch (error) {
      setSelectedError(
        error instanceof Error
          ? error.message
          : "Failed to remove selected country."
      );
    }
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-title">
          <img src="/flag.png" alt="Flag logo" />
        </div>
        <h1>AutoComplete + List Management Demo</h1>
      </header>
      <div className="board">
        <section className="panel panel-fixed">
          <Search
            query={query}
            onQueryChange={setQuery}
            results={searchResults}
            isLoading={isSearching}
            error={searchError}
            onAdd={handleAddCountry}
            selectedCodes={selectedCodes}
          />
        </section>
        <section className="panel panel-selected">
          <SelectedCountries
            countries={selectedCountries}
            onRemove={handleRemoveCountry}
            error={selectedError}
          />
        </section>
      </div>
    </div>
  );
};

export default App;
