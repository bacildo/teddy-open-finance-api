// ShortenedURL.ts
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './';

@Entity("url_short")
export class ShortenedURL extends BaseEntity {

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

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

}
