import {
  Body,
  Controller,
  Get,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UpdateUserRolesDto } from 'src/auth/dto/update-user-roles.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: any) {
    const userId = req.user.userId;
    const user = await this.usersService.findById(userId);
    const { password, ...rest } = user as any;
    return rest;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((u: any) => {
      const { password, ...rest } = u;
      return rest;
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/roles')
  async updateRoles(@Param('id') id: string, @Body() dto: UpdateUserRolesDto) {
    await this.usersService.setUserRoles(id, dto.roles);
    return { message: 'Roles asignados' };
  }
}
