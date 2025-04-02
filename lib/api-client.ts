// lib/api-client.ts
import securityService from './security-service';

type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiRequestOptions {
  method?: ApiMethod;
  body?: any;
  headers?: Record<string, string>;
  auth?: boolean;
}

class ApiClient {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = process.env.API_URL || 'https://api.integriguide.com';
  }
  
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const authState = localStorage.getItem('smap_auth_state');
      if (!authState) return null;
      
      const { token } = JSON.parse(authState);
      return token;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }
  
  async request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {}, auth = true } = options;
    
    // Prepare URL
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    // Prepare headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };
    
    // Add auth token if required and available
    if (auth) {
      const token = this.getAuthToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }
    
    // Add CSRF token for non-GET requests
    if (method !== 'GET' && typeof window !== 'undefined') {
      const csrfToken = securityService.generateCsrfToken();
      requestHeaders['X-CSRF-Token'] = csrfToken;
    }
    
    // Prepare options
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
    };
    
    // Add body for non-GET requests
    if (method !== 'GET' && body) {
      requestOptions.body = JSON.stringify(body);
    }
    
    try {
      const response = await fetch(url, requestOptions);
      
      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error ${response.status}`);
      }
      
      // Parse and return response
      return await response.json();
    } catch (error) {
      console.error(`API request error (${endpoint}):`, error);
      throw error;
    }
  }
  
  // Convenience methods
  get<T>(endpoint: string, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }
  
  post<T>(endpoint: string, body: any, options: Omit<ApiRequestOptions, 'method'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }
  
  put<T>(endpoint: string, body: any, options: Omit<ApiRequestOptions, 'method'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }
  
  delete<T>(endpoint: string, options: Omit<ApiRequestOptions, 'method'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

const apiClient = new ApiClient();
export default apiClient;