import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user/user.entity';
import { Role } from 'src/roles/entities/role/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepo: Repository<Role>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({
      where: { email },
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async createUser(data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    roles?: string[];
  }): Promise<User> {
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('Email ya registrado');
    }

    let roles: Role[] = [];
    if (data.roles && data.roles.length > 0) {
      roles = await this.rolesRepo.findBy({
        role_name: data.roles as any,
      });
    }

    const user = this.usersRepo.create({
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone,
      is_active: true,
      roles,
    });

    return this.usersRepo.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepo.find();
  }

  async setUserRoles(userId: string, roleNames: string[]): Promise<void> {
    const user = await this.usersRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!roleNames || roleNames.length === 0) {
      throw new BadRequestException('roles inválidos');
    }

    const roles = await this.rolesRepo.findBy({
      role_name: In(roleNames),
    });

    if (roles.length !== roleNames.length) {
      throw new BadRequestException('roles inválidos');
    }

    user.roles = roles;
    await this.usersRepo.save(user);
  }
}
