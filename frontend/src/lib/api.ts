const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Base origin for non-API URLs (e.g. /uploads/...) derived from API base.
export const API_ORIGIN = API_BASE_URL.replace(/\/?api\/?$/, '');

class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public errors?: any[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  // Only add Content-Type if not FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.message || "API request failed",
        data.errors
      );
    }

    // Backend standard response shape:
    // { success: boolean, message?: string, data: <payload>, errors?: any[] }
    // Return payload directly for convenience.
    if (data && typeof data === 'object' && 'data' in data) {
      return (data as any).data;
    }
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network error or other fetch error
    throw new ApiError(0, error instanceof Error ? error.message : 'Network error occurred');
  }
};

export { ApiError };
export default apiFetch;

// Helper function to handle common API patterns
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; message: string; data: T }> => {
  return apiFetch(endpoint, options);
};
