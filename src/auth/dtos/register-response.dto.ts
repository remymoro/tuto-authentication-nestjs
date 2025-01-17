// src/auth/dto/register-response.dto.ts
import { AccessToken } from '../types/AccessToken';

export class RegisterResponseDTO implements AccessToken {
  access_token: string;
}
