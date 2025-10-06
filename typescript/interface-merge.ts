// 인터페이스 중복선언 시 병합
interface Clock {
  time: Date;
}

interface Clock {
  brand: string;
}

interface Clock {
  price: number;
}

const clock: Clock = {
  time: new Date(),
  brand: "롤렉스",
  price: 10000,
}

console.log(clock);