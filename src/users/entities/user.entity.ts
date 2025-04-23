import { IsOptional } from 'class-validator';
import { Application } from 'src/application/entities/application.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  accessToken: string;

  @Column({ default: 'user' })
  role: 'user' | 'employer' | 'admin';

  @OneToMany(() => Application, (application) => application.user)
  applications: Application[];
}
