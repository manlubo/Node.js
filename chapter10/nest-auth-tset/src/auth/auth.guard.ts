import {CanActivate, Injectable} from "@nestjs/common";
import {AuthService} from "./auth.service";


@Injectable()
export class LoginGuard implements CanActivate { // CanActivate 인터페이스 구현
  constructor(private authService: AuthService) {}

  // CanActivate 인터페이스의 메서드
  async canActivate(context: any): Promise<boolean> {
    // 리퀘스트 정보 가져옴
    const request = context.switchToHttp().getRequest();

    // 쿠키가 있으면 인증된 것
    if (request.cookies['login']) {
      return true;
    }

    // 쿠키가 없으면 request의 body 정보 확인
    if(!request.body.email || !request.body.password) {
      return false;
    }

    const user = await this.authService.validateUser(
      request.body.email,
      request.body.password,
    );

    if (!user) {
      return false;
    }

    request.user = user;
    return true;
  }
}