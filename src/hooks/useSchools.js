import { useState, useEffect, useCallback } from "react";
import { listSchools } from "../services/api";
import { MOCK_SCHOOLS } from "../data/mockSchools";

function normalizeSchool(s) {
  const needs = (s.needs ?? []).map(n => ({
    id:           n.id,
    categoria:    n.categoria    ?? "",
    subcategoria: n.subcategoria ?? "",
    propuesta:    n.propuesta    ?? "",
    cantidad:     parseFloat(n.cantidad ?? 0),
    unidad:       n.unidad       ?? "",
    estado:       n.estado       ?? "",
    detalles:     n.detalles     ?? "",
  }));

  const categories = [...new Set(needs.map(n => n.categoria).filter(Boolean))];

  const total  = needs.length;
  const score  = needs.reduce((acc, n) =>
    acc + (n.estado === "Cubierto" ? 1 : n.estado === "Cubierto parcialmente" ? 0.5 : 0), 0);
  const funded = total > 0 ? Math.round((score / total) * 100) : 0;

  const uncovered = needs.filter(n => n.estado === "Aun no cubierto").length;
  const urgent    = uncovered > 5;

  return {
    id:               s.id,
    escuela:          s.escuela          ?? "",
    municipio:        s.municipio        ?? "",
    plantel:          s.plantel          ?? "",
    nivel_educativo:  s.nivel_educativo  ?? "",
    estudiantes:      s.estudiantes      ?? 0,
    personal_escolar: s.personal_escolar ?? 0,
    direccion:        s.direccion        ?? "",
    cct:              s.cct              ?? "",
    modalidad:        s.modalidad        ?? "",
    turno:            s.turno            ?? "",
    sostenimiento:    s.sostenimiento    ?? "",
    ubicacion:        s.ubicacion        ?? "",
    name:        s.escuela   ?? "",
    municipality:s.municipio ?? "",
    type:        s.nivel_educativo ?? "",
    description: "",
    funded,
    students:    s.estudiantes      ?? 0,
    teachers:    s.personal_escolar ?? 0,
    urgent,
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
      if (search)                          params.search    = search;
      if (filters.municipios?.length === 1)  params.municipio = filters.municipios[0];
      if (filters.niveles?.length === 1)     params.nivel     = filters.niveles[0];
      if (filters.categorias?.length === 1)  params.categoria = filters.categorias[0];

      const { schools: raw, pagination: pg } = await listSchools(params);
      let normalized = raw.map(normalizeSchool).filter(s => s.needs.length > 0);

      if (filters.municipios?.length  > 1) normalized = normalized.filter(s => filters.municipios.includes(s.municipio));
      if (filters.niveles?.length     > 1) normalized = normalized.filter(s => filters.niveles.includes(s.nivel_educativo));
      if (filters.categorias?.length  > 1) normalized = normalized.filter(s => s.categories.some(c => filters.categorias.includes(c)));

      setSchools(normalized);
      setPagination(pg);
      setUsingMock(false);
    } catch (err) {
      console.warn("[useSchools] API unavailable, using mock:", err.message);
      let mock = [...MOCK_SCHOOLS];
      if (search) {
        const q = search.toLowerCase();
        mock = mock.filter(s => (s.name ?? s.escuela ?? "").toLowerCase().includes(q) || (s.municipality ?? s.municipio ?? "").toLowerCase().includes(q));
      }
      if (filters.municipios?.length)  mock = mock.filter(s => filters.municipios.includes(s.municipio ?? s.municipality));
      if (filters.categorias?.length)  mock = mock.filter(s => s.categories?.some(c => filters.categorias.includes(c)));
      if (filters.niveles?.length)     mock = mock.filter(s => filters.niveles.includes(s.nivel_educativo ?? s.type));
      setSchools(mock);
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  }, [search, filtersKey]);

  useEffect(() => { fetchSchools(); }, [fetchSchools]);

  return { schools, pagination, loading, usingMock, refetch: fetchSchools };
}
