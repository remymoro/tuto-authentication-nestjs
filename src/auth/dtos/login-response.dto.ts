// src/auth/dto/login-response.dto.ts
import { AccessToken } from '../types/AccessToken';

export class LoginResponseDTO implements AccessToken {
  access_token: string;
}
