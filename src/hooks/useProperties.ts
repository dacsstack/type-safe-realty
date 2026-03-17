import { useEffect, useState } from "react";
import { propertyService } from "../services/propertyService";
import { Property, PropertyFilters } from "../types/api";

export const useProperties = (filters?: PropertyFilters) => {
  const [data, setData] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await propertyService.list(filters);
        if (active) setData(result);
      } catch (e) {
        if (active)
          setError(
            e instanceof Error ? e.message : "Failed to fetch properties",
          );
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [filters?.location, filters?.maxPrice, filters?.minPrice, filters?.type]);

  return { data, loading, error };
};
