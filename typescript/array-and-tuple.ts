// 배열
const numbers: number[] = [1, 2, 3, 4, 5];
const stringArray: Array<string> = ["a", "b", "c", "d", "e"];

const oneToTen = [...numbers];
console.log(...oneToTen);

// 객체 배열
const idols: { name: string; birth: number }[] = [
  {name: "eunbi", birth: 1995},
  {name: "karina", birth: 1999},
  {name: "winter", birth: 2002},
  {name: "jijel", birth: 1999},
];

const gameConsoleArray: Array<{ name: string; launch: number }> = [
  {name: "플레이스테이션5", launch: 2020},
  {name: "닌텐도 스위치", launch: 2017},
]


// 튜플
const myTuple: [string, number] = ["eunbi", 163];

// 튜플은 함수의 매개변수가 여러 개일 때 유용
function printMyInfo(label: string, info: [string, number]) {
  console.log(`[${label}]`, ...info);
}

printMyInfo("튜플 테스트", myTuple);

function fetchUser(): [string, number] {
  return ["eunbi", 163];
}

const [name24, height24] = fetchUser();
console.log(name24, height24);