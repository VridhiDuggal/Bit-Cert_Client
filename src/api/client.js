const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const STATUS_MESSAGES = {
  400: 'Invalid request. Please check your input.',
  401: 'Invalid credentials.',
  403: 'You do not have permission to do that.',
  404: 'The requested resource was not found.',
  409: 'Organisation already exists.',
  422: 'Invalid input data.',
  429: 'Too many requests. Please wait a moment.',
  500: 'Something went wrong. Please try again.',
};

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function request(path, options = {}) {
  const { method = 'GET', body, headers = {}, token, signal } = options;

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Unable to reach the server. Check your connection.', 0, null);
  }

  const contentType = res.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const safeMessage = STATUS_MESSAGES[res.status] ?? STATUS_MESSAGES[500];
    if (import.meta.env.DEV) {
      console.warn('[API]', res.status, path, data);
    }
    throw new ApiError(safeMessage, res.status, data);
  }

  return data;
}
