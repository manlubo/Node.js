// any 사용은 지양해야함.
function echo(message: any): any {
  console.log("in echo : ", message);
  return message;
}

type phone = {
  name: string;
  price: number;
  brand: string;
}

const myPhone = {name: "iPhone15", price: 1000, brand: "Apple"};
echo(1);
echo("안녕");
echo(myPhone);

// 제네릭을 활용해서 변경
function genericEcho<T>(message: T): T {
  console.log(message);
  return message;
}

// 타입을 명시하지 않으면 컴파일러가 타입 추론
genericEcho(1);

// 타입을 명시적으로 지정
genericEcho<string>("안녕")

// any사용 시 제네릭 쓸 이유가 없음...
genericEcho<any>(myPhone);

// 타입이 달라 에러 발생
// genericEcho<string>(myPhone);

