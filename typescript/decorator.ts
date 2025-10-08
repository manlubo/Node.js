// 생성자 메서드 타입
type Constructor = new(...arg: any[]) => {};

function HelloDecorator(constructor: Constructor) {
  return class extends constructor {
    constructor() {
      console.log("Hello!")
      super();
    }
  }
}

@HelloDecorator
class DecoratorTest {
  constructor() {
    console.log(`인스턴스 생성됨`)
  }
}

const decoTest = new DecoratorTest();

function Timer(value: (this: unknown, ...args: any[]) => any, context: ClassMethodDecoratorContext) {
  return function (this: unknown, ...args: any[]) {
    console.time("Elapsed time");
    const result = value.apply(this, args);
    console.timeEnd("Elapsed time");
    return result;
  };
}

class ElapsedTime {
  @Timer
  hello() {
    console.log("Hello!");
  }
}

new ElapsedTime().hello();
