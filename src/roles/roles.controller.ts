import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from 'src/auth/dto/create-role.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Roles('admin')
  async create(@Body() dto: CreateRoleDto) {
    const role = await this.rolesService.create(dto);
    return {
      message: 'Rol creado con éxito',
      roleId: role.id,
    };
  }

  @Get()
  @Roles('admin')
  async findAll() {
    return this.rolesService.findAll();
  }
}
