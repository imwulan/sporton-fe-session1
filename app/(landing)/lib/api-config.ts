/**
 * The Swagger docs for this API list `http://localhost:5001/api` as the
 * server (a local dev server), not a public production URL. The value
 * below is a best-guess default for the deployed backend and MUST be
 * confirmed — override it via NEXT_PUBLIC_API_BASE_URL in `.env.local`
 * if it turns out to be different.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://be-sporton.agunacourse.com/api";

/**
 * Uploaded assets (product/category images) are returned by the API as
 * paths relative to the server root (e.g. "uploads/product-image.jpg"),
 * not under the "/api" prefix. This strips a trailing "/api" from
 * API_BASE_URL to get the correct origin to prefix those paths with.
 */
export const ASSET_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");
