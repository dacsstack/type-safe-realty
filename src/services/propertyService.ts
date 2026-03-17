import { Property, PropertyFilters } from "../types/api";
import { httpClient } from "./httpClient";

const toQuery = (filters?: PropertyFilters): string => {
  if (!filters) return "";

  const query = new URLSearchParams();

  if (filters.location) query.set("location", filters.location);
  if (filters.type) query.set("type", filters.type);
  if (typeof filters.minPrice === "number")
    query.set("minPrice", String(filters.minPrice));
  if (typeof filters.maxPrice === "number")
    query.set("maxPrice", String(filters.maxPrice));

  const output = query.toString();
  return output ? `?${output}` : "";
};

export const propertyService = {
  list(filters?: PropertyFilters): Promise<Property[]> {
    return httpClient.get<Property[]>(`/project${toQuery(filters)}`);
  },
};
