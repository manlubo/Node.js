// 인터섹션타입 객체 - 두개를 모두 만족해야하는 객체(&)
type cup = {
  size: string;
}

type brand = {
  brandName: string;
}

type brandedCup = cup & brand;

let starbucksGrandeSizeCup: brandedCup = {
  brandName: "스타벅스",
  size: "grande"
}

console.log(starbucksGrandeSizeCup)