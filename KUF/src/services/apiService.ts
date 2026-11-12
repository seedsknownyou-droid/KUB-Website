const isLocalHost = (host: string) => host === 'localhost' || host === '127.0.0.1' || host === '[::1]';

/**
 * Address of the backend.
 *  - Set VITE_API_BASE_URL in production.
 *  - In development without it, the backend is assumed to run on the same machine as the page,
 *    port 5000 - so opening http://192.168.1.10:3000 from another PC calls http://192.168.1.10:5000.
 *  - A "localhost" address is swapped for the page's own address when the page is opened from another PC
 *    (otherwise "localhost" would mean that other PC itself).
 */
function resolveApiBaseUrl(): string {
  const configured = (import.meta.env.VITE_API_BASE_URL as string | undefined) || '';
  const pageHost = typeof window !== 'undefined' ? window.location.hostname : '';
  const pageProtocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';

  let base = configured || (import.meta.env.DEV && pageHost ? `${pageProtocol}//${pageHost}:5001` : '');
  if (base && pageHost && !isLocalHost(pageHost)) {
    try {
      const url = new URL(base);
      if (isLocalHost(url.hostname)) {
        url.hostname = pageHost;
        base = url.toString();
      }
    } catch {
      /* not an absolute URL: leave it as it is */
    }
  }
  return base.replace(/\/+$/, '');
}

const API_BASE_URL = resolveApiBaseUrl();

const REQUEST_TIMEOUT_MS = 30000;

export interface ApiProduct {
  serialNumber: string;
  productName: string;
  isRegistered: boolean;
  registeredAt: string | null;
}

export interface VerifyResponse {
  success: boolean;
  valid: boolean;
  canRegister: boolean;
  message: string;
  product: ApiProduct;
}

export interface RegisterPayload {
  /** Hash from the QR link (/r/<hash>). Preferred: the serial number is never put in the link. */
  hash?: string;
  /** Plain serial number (only accepted while the backend has ALLOW_PLAIN_SERIAL=true) */
  serialNumber?: string;
  name: string;
  email: string;
  phone: string;
  agreedToPolicy: boolean;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  product: ApiProduct;
  customer: { name: string; email: string; phone: string };
  notifications: {
    sms: { queued: boolean };
    email: { queued: boolean; skipped?: boolean };
  };
}

export interface CustomerMessagePayload {
  serialNumber: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface MessageResponse {
  success: boolean;
  id: string;
  emailSent: boolean;
  message: string;
}

export interface CustomerProductsResponse {
  success: boolean;
  count: number;
  products: ApiProduct[];
}

export type AuthPurpose = 'signin' | 'signup';

export interface AuthCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface SendOtpPayload {
  phone: string;
  purpose: AuthPurpose;
  /** Sign up only */
  name?: string;
  email?: string;
}

export interface SendOtpResponse {
  success: boolean;
  phone: string;
  resendAfterSeconds: number;
}

export interface VerifyOtpPayload {
  phone: string;
  otp: string;
  purpose: AuthPurpose;
}

export interface VerifyOtpResponse {
  success: boolean;
  customer: AuthCustomer;
  isNew: boolean;
}

export class ApiError extends Error {
  status: number;
  code: string;
  data: any;

  constructor(message: string, status: number, code: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

async function request<T>(path: string, options: RequestInit = {}, timeoutMs: number = REQUEST_TIMEOUT_MS): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      signal: controller.signal
    });

    let data: any = null;
    try {
      data = await response.json();
    } catch {
      /* non-JSON response */
    }

    if (!response.ok) {
      throw new ApiError(
        data?.message || 'Something went wrong. Please try again.',
        response.status,
        data?.code || 'HTTP_ERROR',
        data
      );
    }
    return data as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;

    const timedOut = (err as Error)?.name === 'AbortError';
    // Visible in the browser console (F12) to help find the real cause
    console.error(`API request failed: ${options.method || 'GET'} ${API_BASE_URL}${path}`, err);

    if (timedOut) {
      throw new ApiError('The server is taking too long to respond. Please try again.', 0, 'TIMEOUT');
    }
    throw new ApiError(
      'Unable to reach the server. Please check your internet connection and try again.',
      0,
      'NETWORK_ERROR'
    );
  } finally {
    clearTimeout(timer);
  }
}

const post = <T,>(path: string, body: unknown, timeoutMs?: number) =>
  request<T>(path, { method: 'POST', body: JSON.stringify(body) }, timeoutMs);

/** Saving a registration can be slow on a weak connection, so it is allowed to take longer than other calls. */
const REGISTER_TIMEOUT_MS = 60000;

export const apiService = {
  /** Checks the scanned serial number against Firebase. */
  verifyProduct: (serialNumber: string) =>
    request<VerifyResponse>(`/api/products/${encodeURIComponent(serialNumber)}`),

  /** Hash mapping: checks the hash from the QR link; the reply contains the product (and its serial number). */
  verifyByHash: (hash: string) => request<VerifyResponse>(`/api/qr/${encodeURIComponent(hash)}`),

  /** Registers the product; backend also sends the confirmation SMS and email. */
  registerProduct: (payload: RegisterPayload) =>
    post<RegisterResponse>('/api/register', payload, REGISTER_TIMEOUT_MS),

  /** Every product registered with this phone number (My Favorites). */
  getCustomerProducts: (phone: string) =>
    post<CustomerProductsResponse>('/api/customers/products', { phone }),

  /** Sign in / Sign up step 1: sends a 6 digit code by SMS. */
  sendOtp: (payload: SendOtpPayload) => post<SendOtpResponse>('/api/auth/send-otp', payload),

  /** Sign in / Sign up step 2: checks the code and returns the customer. */
  verifyOtp: (payload: VerifyOtpPayload) => post<VerifyOtpResponse>('/api/auth/verify-otp', payload),

  /** Feedback form -> emailed to the configured company address. */
  sendFeedback: (payload: CustomerMessagePayload) => post<MessageResponse>('/api/feedback', payload),

  /** Report Incident form -> emailed to the configured incident address. */
  reportIncident: (payload: CustomerMessagePayload) => post<MessageResponse>('/api/incidents', payload)
};