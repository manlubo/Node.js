import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {AuthGuard} from "@nestjs/passport";


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

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
  async canActivate(context: any): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    // 로컬 스트래티지 실행
    const request = context.switchToHttp().getRequest();
    // 세션 저장
    await super.logIn(request);
    return result;
  }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // 세션에서 정보를 읽어서 인증을 확인
    return request.isAuthenticated();
  }
}