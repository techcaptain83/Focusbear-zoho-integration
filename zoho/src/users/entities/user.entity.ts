import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  firstName: string;

  @Column({
    nullable: true,
  })
  lastName: string;

  @Column()
  email: string;

  @Column({
    nullable: true,
  })
  dataServer: string;

  @Column()
  accessToken: string;

  @Column({
    nullable: true,
  })
  location: string;

  @Column({
    nullable: true,
  })
  accountServer: string;

  @Column()
  refreshToken: string;
}
