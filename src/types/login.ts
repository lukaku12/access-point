export interface AuthResponse {
  success: boolean;
}

export interface ConnectionDetails {
  ip: string;
  port: number;
  auth_key: string;
}
