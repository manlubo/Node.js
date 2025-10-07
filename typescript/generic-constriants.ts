// 제네릭 제약조건 걸기
interface IcheckLength {
  length: number;
}

function echoWithLength<T extends IcheckLength>(message: T){
  console.log(message);
}

echoWithLength("Hello");
echoWithLength([1, 2, 3, 4, 5]);
echoWithLength({length: 10});
// echoWithLength(10);