let username: string = "Eunbi";
let height: number = 163;
let isConditionGood: boolean = true;

let myInfoWithGender: {
  name: string;
  height: number;
  isConditionGood: boolean;
  gender?: string; // ?를 붙이면 선택적 속성(없어도 됨)
} = {
  name: "Eunbi",
  height: 163,
  isConditionGood: true,
}

console.log(myInfoWithGender);