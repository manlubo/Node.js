// 유니온 타입은 변수 하나에 여러가지 타입으로 지정 가능
let anyValue: number | string | boolean = 10;

printAny(anyValue);
anyValue = "hello";
printAny(anyValue);
anyValue = true;
printAny(anyValue);


// 내로잉은 타입의 범위를 좁하는 것 (typeof, instanceof, in)
function printAny(value: number | string | boolean): void {
  if (typeof value === "number") {
    console.log(value);
  } else if (typeof value === "string") {
    console.log(value.toUpperCase());
  } else {
    console.log(value? "참" : "거짓");
  }
}