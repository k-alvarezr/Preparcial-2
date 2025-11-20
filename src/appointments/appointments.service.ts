import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UsersService } from '../users/users.service';

interface JwtUserPayload {
  userId: string;
  email: string;
  roles: string[];
}

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepo: Repository<Appointment>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateAppointmentDto, userId: string) {
    const user = await this.usersService.findById(userId);

    const appointment = this.appointmentsRepo.create({
      user,
      datetime: new Date(dto.datetime),
      description: dto.description,
      status: 'pending',
    });

    return this.appointmentsRepo.save(appointment);
  }

  async listForUser(user: JwtUserPayload) {
    const roles = user.roles ?? [];

    if (roles.includes('admin')) {
      return this.appointmentsRepo.find({ order: { datetime: 'ASC' } });
    }

    if (roles.includes('doctor')) {
      return this.appointmentsRepo.find({ order: { datetime: 'ASC' } });
    }

    return this.appointmentsRepo.find({
      where: { user: { id: user.userId } },
      order: { datetime: 'ASC' },
    });
  }

  async updateStatus(id: string, dto: UpdateStatusDto, user: JwtUserPayload) {
    const roles = user.roles ?? [];
    if (!roles.includes('doctor')) {
      throw new ForbiddenException(
        'Solo el doctor puede actualizar el estado de la cita',
      );
    }

    const appointment = await this.appointmentsRepo.findOne({ where: { id } });
    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }

    if (appointment.status !== 'pending') {
      throw new BadRequestException(
        'Solo citas en estado pending pueden cambiar de estado',
      );
    }

    appointment.status = dto.status;
    return this.appointmentsRepo.save(appointment);
  }

  async delete(id: string, user: JwtUserPayload) {
    const appointment = await this.appointmentsRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }

    if (appointment.user.id !== user.userId) {
      throw new ForbiddenException('Solo puedes cancelar tus propias citas');
    }

    await this.appointmentsRepo.remove(appointment);
    return { message: 'Cita eliminada' };
  }
}
