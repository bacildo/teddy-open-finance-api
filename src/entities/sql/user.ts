import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_info")
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column()
  password!: string;
}
