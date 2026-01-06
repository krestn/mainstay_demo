export type Country = {
  code: string;
  name: string;
  flagUrl: string;
  officialName?: string;
  capital?: string;
  region?: string;
  subregion?: string;
  population?: number;
  languages?: string[];
  currencies?: string[];
  area?: number;
};
