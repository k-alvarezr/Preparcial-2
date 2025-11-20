import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class UpdateUserRolesDto {
  @IsArray()
  @ArrayNotEmpty({ message: 'roles inválidos' })
  @IsString({ each: true })
  roles: string[];
}
