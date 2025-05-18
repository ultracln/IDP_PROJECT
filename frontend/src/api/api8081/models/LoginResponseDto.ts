export interface LoginResponseDto {
  access_token: string;
  token_type?: string; // optional, default e "Bearer"
  expires_in?: number;
}