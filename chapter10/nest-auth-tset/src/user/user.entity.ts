import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity()
export class User {
  // 자동증가(생성할때 없음)
  @PrimaryGeneratedColumn()
  id?: number;

  // 이메일은 유니크한 값
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP"})
  regDate: Date = new Date();
}