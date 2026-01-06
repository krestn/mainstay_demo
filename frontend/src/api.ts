import { Country } from "./types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

export const fetchSelectedCountries = async () => {
  const response = await fetch(`${API_BASE_URL}/selected-countries/`);
  if (!response.ok) {
    throw new Error("Failed to load selected countries.");
  }
  return (await response.json()) as Country[];
};

export const saveSelectedCountry = async (country: Country) => {
  const response = await fetch(`${API_BASE_URL}/selected-countries/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(country),
  });
  if (!response.ok) {
    throw new Error("Failed to save selected country.");
  }
  return (await response.json()) as Country;
};

export const removeSelectedCountry = async (country: Country) => {
  const response = await fetch(`${API_BASE_URL}/selected-countries/${country.code}/`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to remove selected country.");
  }
};

export const searchCountries = async (
  query: string,
  signal: AbortSignal
): Promise<Country[]> => {
  const normalizedQuery = query.trim().toLowerCase();
  const response = await fetch(
    `https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`,
    { signal }
  );
  if (!response.ok) {
    throw new Error("No matching results.");
  }
  const data = (await response.json()) as Array<{
    cca3: string;
    name?: { common?: string; official?: string };
    flags?: { png?: string };
    capital?: string[];
    region?: string;
    subregion?: string;
    population?: number;
    languages?: Record<string, string>;
    currencies?: Record<string, { name: string }>;
    area?: number;
  }>;
  const normalized = data
    .filter((item) => item.name?.common && item.flags?.png && item.cca3)
    .map((item) => ({
      code: item.cca3,
      name: item.name?.common ?? "Unknown",
      officialName: item.name?.official ?? undefined,
      capital: item.capital?.[0],
      region: item.region,
      subregion: item.subregion,
      population: item.population,
      languages: item.languages ? Object.values(item.languages) : undefined,
      currencies: item.currencies
        ? Object.values(item.currencies).map((currency) => currency.name)
        : undefined,
      area: item.area,
      flagUrl: item.flags?.png ?? "",
    }));
  normalized.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    const aStarts = aName.startsWith(normalizedQuery) ? 0 : 1;
    const bStarts = bName.startsWith(normalizedQuery) ? 0 : 1;
    if (aStarts !== bStarts) {
      return aStarts - bStarts;
    }
    return aName.localeCompare(bName);
  });
  return normalized.slice(0, 5);
};
