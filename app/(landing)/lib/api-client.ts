import { API_BASE_URL } from "./api-config";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const apiGet = async <T>(
  path: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    method: "GET",
    headers: {
      Accept: "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(
      `Request to ${path} failed with status ${response.status}`,
      response.status
    );
  }

  return response.json() as Promise<T>;
};

/**
 * POST helper for multipart/form-data endpoints (e.g. /transactions/checkout,
 * which requires multipart/form-data since it can also accept an image
 * file). Deliberately does NOT set a Content-Type header — the browser
 * must set it itself, including the multipart boundary parameter. Setting
 * it manually here would break the request.
 */
export const apiPostFormData = async <T>(
  path: string,
  formData: FormData
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });

  if (!response.ok) {
    let message = `Request to ${path} failed with status ${response.status}`;

    try {
      const errorBody = (await response.json()) as { message?: string };
      if (errorBody?.message) {
        message = errorBody.message;
      }
    } catch {
      // Response body wasn't JSON — fall back to the generic message above.
    }

    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
};

/**
 * PUT helper for multipart/form-data endpoints, e.g. PUT /transactions/:id
 * which — per the Swagger docs — expects the same full field set as
 * creation (image, status, purchasedItems, totalPayment, customerName,
 * customerContact, customerAddress), not a partial update. Same
 * Content-Type caveat as apiPostFormData applies.
 */
export const apiPutFormData = async <T>(
  path: string,
  formData: FormData
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });

  if (!response.ok) {
    let message = `Request to ${path} failed with status ${response.status}`;

    try {
      const errorBody = (await response.json()) as { message?: string };
      if (errorBody?.message) {
        message = errorBody.message;
      }
    } catch {
      // Response body wasn't JSON — fall back to the generic message above.
    }

    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
};
