// Импортируем декораторы для сущностей и колонок  
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export type UserRole = "admin" | "user";
export type UserStatus = "active" | "inactive";
// Декоратор @Entity() говорит TypeORM, что данный класс это таблица в базе
@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullName!: string;

  @Column({ type: "date" })
  birthDate!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: "enum", enum: ["admin", "user"], default: "user" })
  role!: UserRole;

  @Column({ type: "enum", enum: ["active", "inactive"], default: "active" })
  status!: UserStatus;
}
