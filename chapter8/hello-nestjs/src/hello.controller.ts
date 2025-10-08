import { Controller, Get } from '@nestjs/common';

// 컨트롤러 데코레이터
@Controller()
export class HelloController { // 외부에서 사용하기 때문에 export 붙여줌
  @Get()
  hello() {
    return '안녕하세요! NestJS로 만든 첫 애플리케이션입니다.';
  }
}