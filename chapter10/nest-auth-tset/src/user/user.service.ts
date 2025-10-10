import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm"; // 레포지토리 주입 데코레이터
import {Repository} from "typeorm"; // 레포지토리 임포트
import {User} from "./user.entity";

@Injectable()
export class UserService {
  // 레포지토리 주입
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  createUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async getUser(email: string) {
    const result = await this.userRepository.findOne({
      where: { email }
    })
    return result;
  }

  async updateUser(email: string, _user){
    const user:User = await this.getUser(email) as User;
    console.log(_user);
    user.username = _user.username;
    user.password = _user.password;
    console.log(user);
    await this.userRepository.save(user);
  }

  deleteUser(email: string) {
    return this.userRepository.delete({email});
  }
}
