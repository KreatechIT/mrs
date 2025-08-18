/**
 * Authentication related TypeScript interfaces
 */

// Login Credentials Interface
export interface LoginCredentials {
  username: string;
  password: string;
}

// Authentication Tokens Interface
export interface AuthTokens {
  access: string;
  refresh: string;
}

// Authentication Response Interface
export interface AuthResponse {
  id: number;
  username: string;
  access: string;
  refresh: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
}

// Token Verification Response
export interface TokenVerificationResponse {
  valid: boolean;
  user_id?: number;
  username?: string;
  exp?: number;
}

// Refresh Token Request
export interface RefreshTokenRequest {
  refresh: string;
}

// Refresh Token Response
export interface RefreshTokenResponse {
  access: string;
  refresh?: string;
}

// Logout Request
export interface LogoutRequest {
  refresh: string;
}