// ═══════════════════════════════════════════════════
// CIRO NEXUS V2 — Auth Utilities
// ═══════════════════════════════════════════════════

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const TOKEN_KEY = "ciro_nexus_token";

/**
 * Retrieve the stored JWT from localStorage.
 * Returns null if no token is found or if running on the server.
 */
export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Persist a JWT to localStorage.
 * @param {string} token — the JWT access token
 */
export function setToken(token) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Remove the stored JWT from localStorage (logout).
 */
export function removeToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Check whether a token exists in storage.
 * NOTE: This does NOT validate expiry — it only checks presence.
 */
export function isAuthenticated() {
  return !!getToken();
}

/**
 * A thin wrapper around `fetch` that automatically injects
 * the Authorization header when a token is available.
 *
 * @param {string} url — the full URL or a path relative to API_BASE
 * @param {RequestInit} [options={}] — standard fetch options
 * @returns {Promise<Response>}
 */
export async function fetchWithAuth(url, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fullUrl = url.startsWith("http") ? url : `${API_BASE}${url}`;

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  return response;
}
