import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "./user";

@Entity("url_short")
export class ShortenedURLEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string;

  @Column()
  short_url!: string;

  @Column({ default: 0 })
  count_clicks!: number;

  @Column({ nullable: true })
  deletedAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "userId" })
  user!: UserEntity;
}
