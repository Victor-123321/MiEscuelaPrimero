import { useState, useEffect, useCallback } from "react";
import { listSchools } from "../services/api";
import { MOCK_SCHOOLS } from "../data/mockSchools";

/**
 * Maps backend school → UI shape.
 * New needs shape: { categoria, subcategoria, propuesta, cantidad, unidad, estado, detalles }
 */
function normalizeSchool(s) {
  const needs = (s.needs ?? []).map(n => ({
    id:          n.id,
    categoria:   n.categoria   ?? "",
    subcategoria:n.subcategoria?? "",
    propuesta:   n.propuesta   ?? "",
    cantidad:    parseFloat(n.cantidad ?? 0),
    unidad:      n.unidad      ?? "",
    estado:      n.estado      ?? "",
    detalles:    n.detalles    ?? "",
  }));

  // categories from needs
  const categories = [...new Set(needs.map(n => n.categoria).filter(Boolean))];

  return {
    id:          s.id,
    name:        s.name,
    municipality:s.municipality,
    type:        s.type    ?? "",
    description: s.description ?? "",
    funded:      parseFloat(s.funding_pct ?? 0),
    students:    s.students ?? 0,
    teachers:    s.teachers ?? 0,
    urgent:      s.urgent  ?? false,
    image:       s.school_image_url || null,
    categories,
    category:    categories[0] ?? "",
    needs,
  };
}

export function useSchools(filters = {}, search = "") {
  const [schools,    setSchools]    = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [usingMock,  setUsingMock]  = useState(false);

  const filtersKey = JSON.stringify(filters);

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (search) params.search = search;
      if (filters.municipalities?.length === 1) params.municipality = filters.municipalities[0];
      if (filters.types?.length === 1)          params.type          = filters.types[0];
      if (filters.categories?.length === 1)     params.category      = filters.categories[0];

      const { schools: raw, pagination: pg } = await listSchools(params);
      let normalized = raw.map(normalizeSchool);

      // client-side multi-value filter
      if (filters.municipalities?.length > 1) normalized = normalized.filter(s => filters.municipalities.includes(s.municipality));
      if (filters.types?.length > 1)          normalized = normalized.filter(s => filters.types.includes(s.type));
      if (filters.categories?.length > 1)     normalized = normalized.filter(s => s.categories.some(c => filters.categories.includes(c)));

      setSchools(normalized);
      setPagination(pg);
      setUsingMock(false);
    } catch (err) {
      console.warn("[useSchools] API unavailable, using mock:", err.message);
      let mock = [...MOCK_SCHOOLS];
      if (search) {
        const q = search.toLowerCase();
        mock = mock.filter(s => s.name.toLowerCase().includes(q) || s.municipality.toLowerCase().includes(q));
      }
      if (filters.municipalities?.length) mock = mock.filter(s => filters.municipalities.includes(s.municipality));
      if (filters.categories?.length)     mock = mock.filter(s => s.categories?.some(c => filters.categories.includes(c)));
      if (filters.types?.length)          mock = mock.filter(s => filters.types.includes(s.type));
      setSchools(mock);
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  }, [search, filtersKey]);

  useEffect(() => { fetchSchools(); }, [fetchSchools]);

  return { schools, pagination, loading, usingMock, refetch: fetchSchools };
}
