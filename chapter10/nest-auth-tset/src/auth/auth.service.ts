import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {CreateUserDto} from "../user/user.dto";
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async register(userDto: CreateUserDto) {
    const user = await this.userService.getUser(userDto.email);
    if (user) {
      throw new HttpException('해당 이메일로 가입된 아이디가 이미 존재합니다.', HttpStatus.BAD_REQUEST);
    }

    const encodedPassword = bcrypt.hashSync(userDto.password, 10);

    try{
      const user = await this.userService.createUser({
        ...userDto,
        password: encodedPassword,
      });

      delete (user as any).password;
      return user;
    } catch(err){
      throw new HttpException('서버에러', 500);
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.getUser(email);

    if (!user) {
      return null;
    }
    const { password: hashedPassword, ...userInfo } = user;

    if (bcrypt.compareSync(password, hashedPassword)) {
      return userInfo;
    }
    return null;
  }
}
