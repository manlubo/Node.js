// 펑션 타입 (매개변수의 타입 정의 + 리턴값의 타입 정의)
function echo(message: string): string {
  console.log(message);
  return message;
}

// 1. echo 함수를 그대로 변수에 담음
// funcEcho의 타입은 자동으로 (message: string) => string 으로 추론됨
const funcEcho = echo;


// 2. 함수 타입을 별도로 정의 (타입 별칭 방식)
type FuncEcho = (message: string) => string;

// funcEcho2는 FuncEcho 타입을 가져야 함
// 즉, (string을 받고 string을 반환하는 함수만 가능)
const funcEcho2: FuncEcho = echo;


// 3. 함수 타입을 “호출 시그니처(Call Signature)” 형태로 정의
// 객체처럼 보이지만 사실상 함수 타입과 동일함
type FuncEcho3 = {
  (message: string): string; // 호출 시그니처 (함수처럼 호출 가능)
};

// FuncEcho3 타입 변수에 echo 할당
const funcEcho3: FuncEcho3 = echo;

// 정상적으로 호출 가능
funcEcho3("test3");
