import {
  Injectable,
  UnauthorizedException,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    if (!dto.email) {
      throw new BadRequestException('Email inválido');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.createUser({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      phone: dto.phone,
    });

    return {
      message: 'Usuario registrado con éxito',
      userId: user.id,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (!user.is_active) {
      throw new HttpException('Usuario desactivado', 423);
    }

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles?.map((r) => r.role_name) ?? [],
    };

    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }
}
