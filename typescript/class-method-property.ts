// 클래스
class Hello {
  constructor() {
    this.sayHello("created");
  }

  sayHello(message: string) {
    console.log(message);
  }
}

// const hello = new Hello();
// hello.sayHello("안녕하세요~");

class Rectangle {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

const rectangle = new Rectangle(10, 5);

console.log(rectangle.getArea());