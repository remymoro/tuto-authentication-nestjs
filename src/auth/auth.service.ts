import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccessToken } from './types/AccessToken';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10; // Nombre de tours de hachage défini directement

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }

    return user;
  }

  async login(user: User): Promise<AccessToken> {
    const payload = this.createJwtPayload(user);
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(registerDto: RegisterRequestDto): Promise<AccessToken> {
    const existingUser = await this.usersService.findOneByEmail(
      registerDto.email,
    );

    if (existingUser) {
      throw new BadRequestException('exister');
    }

    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      this.saltRounds,
    );
    const newUser: User = { ...registerDto, password: hashedPassword };
    await this.usersService.create(newUser);

    return this.login(newUser);
  }

  private createJwtPayload(user: User) {
    return { id: user.id, email: user.email };
  }
}
