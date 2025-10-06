// 타입
type BookType = {
  title: string;
  price: number;
  author: string;
}

let bookType: BookType = {
  title: "백엔드 개발자 되기",
  price: 10000,
  author: "박승규"
};

// 인터페이스
interface Book {
  title: string;
  price: number;
  author: string;
}

let book: Book = {
  title: "백엔드 개발자 되기",
  price: 10000,
  author: "박승규"
}

// 선택적 속성
interface Car {
  name: string;
  price: number;
  brand: string;
  options?: string[];
}

let avante: Car = {
  name: "아반뗴",
  price: 1500,
  brand: "현대",
  options: ["에어컨, 네비게이션"]
}

let morning: Car = {
  name: "모닝",
  price: 650,
  brand: "기아",
}

// readonly = 한번 정해지면 수정 불가
interface Citizen {
  id: string;
  name: string;
  region: string;
  readonly age: number;
}

let eunbi: Citizen = {
  id: "123456",
  name: "권은비",
  region: "서울",
  age: 31,
}

