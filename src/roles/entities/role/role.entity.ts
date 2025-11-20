import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/users/entities/user/user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  role_name: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
