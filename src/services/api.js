
const BASE_URL = import.meta.env.VITE_API_URL || "/api/v1";

export const getToken   = ()      => localStorage.getItem("mep_token");
export const setToken   = (t)     => localStorage.setItem("mep_token", t);
export const clearToken = ()      => localStorage.removeItem("mep_token");

async function request(method, path, body = null, isMultipart = false) {
  const headers = {};
  if (!isMultipart) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const options = { method, headers };
  if (body) options.body = isMultipart ? body : JSON.stringify(body);
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (res.status === 204) return null;
  const json = await res.json();
  if (!res.ok) {
    const message = json?.errors?.[0]?.message || json?.message || `Error ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.errors = json?.errors;
    throw err;
  }
  return json;
}

const get           = (path)       => request("GET",    path);
const post          = (path, body) => request("POST",   path, body);
const put           = (path, body) => request("PUT",    path, body);
const patch         = (path, body) => request("PATCH",  path, body);
const del           = (path)       => request("DELETE", path);
const postForm      = (path, fd)   => request("POST",   path, fd, true);

// ── AUTH ─────────────────────────────────────────────────────────────────
export async function login(email, password) {
  const res = await post("/auth/login", { email, password });
  const { token, user } = res.data;
  setToken(token);
  return { token, user };
}
export async function logout() {
  try { await post("/auth/logout"); } finally { clearToken(); }
}
export async function verifyToken() {
  const res = await post("/auth/verify");
  return res.data.user;
}

// ── SCHOOLS ──────────────────────────────────────────────────────────────
export async function listSchools(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== "") qs.set(k, v); });
  const res = await get(`/schools${qs.toString() ? `?${qs}` : ""}`);
  return { schools: res.data, pagination: res.pagination };
}
export async function getSchool(id) { return (await get(`/schools/${id}`)).data; }
export async function getSchoolFilters() { return (await get("/schools/filters")).data; }
export async function createSchool(payload) { return (await post("/schools", payload)).data; }
export async function updateSchool(id, payload) { return (await put(`/schools/${id}`, payload)).data; }
export async function deleteSchool(id) { return del(`/schools/${id}`); }
export async function addNeed(schoolId, payload) { return (await post(`/schools/${schoolId}/needs`, payload)).data; }
export async function updateNeed(schoolId, needId, payload) { return (await put(`/schools/${schoolId}/needs/${needId}`, payload)).data; }
export async function deleteNeed(schoolId, needId) { return del(`/schools/${schoolId}/needs/${needId}`); }

// ── STATS ─────────────────────────────────────────────────────────────────
export async function getStats() { return (await get("/stats")).data; }
export async function updateStat(statKey, payload) { return (await put(`/stats/${statKey}`, payload)).data; }

// ── FOOTER ────────────────────────────────────────────────────────────────
export async function getFooterContent() { return (await get("/content/footer")).data; }
export async function updateFooterContent(contentKey, contentValue) {
  return (await put(`/content/footer/${contentKey}`, { content_value: contentValue })).data;
}

// ── UPLOAD ────────────────────────────────────────────────────────────────
export async function uploadSchoolsFile(file) {
  const fd = new FormData();
  fd.append("file", file);
  return (await postForm("/upload/schools", fd)).data;
}
export async function getUploadHistory(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return (await get(`/upload/history${qs ? `?${qs}` : ""}`)).data;
}

// ── LEADS (donor form) ────────────────────────────────────────────────────
export async function submitLead(payload) { return (await post("/leads", payload)).data; }
export async function listLeads(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await get(`/leads${qs ? `?${qs}` : ""}`);
  return { leads: res.data, pagination: res.pagination };
}
export async function updateLeadStatus(id, status) {
  return (await patch(`/leads/${id}/status`, { status })).data;
}
