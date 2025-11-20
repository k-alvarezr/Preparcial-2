import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role/role.entity';
import { CreateRoleDto } from 'src/auth/dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepo: Repository<Role>,
  ) {}

  async create(dto: CreateRoleDto): Promise<Role> {
    const exists = await this.rolesRepo.findOne({
      where: { role_name: dto.role_name },
    });
    if (exists) {
      throw new ConflictException('role_name ya existe');
    }

    const role = this.rolesRepo.create(dto);
    return this.rolesRepo.save(role);
  }

  async findAll(): Promise<Role[]> {
    try {
      return await this.rolesRepo.find();
    } catch (e) {
      throw new InternalServerErrorException('Error al obtener roles');
    }
  }
}
