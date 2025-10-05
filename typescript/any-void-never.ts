// 결과값이 무엇이든 들어갈 수 있음(지양하는 것이 좋음)
let anyValue: any = 10;
anyValue = "hello";
anyValue = true;

// 함수의 결과 값이 없음
function print(value: any): void {
  console.log(value);
}

// 예외를 던짐
function throwError(message: string): never {
  throw new Error(message);
}

// 무한루프
function infiniteLoop(): never {
  while (true) {}
}

