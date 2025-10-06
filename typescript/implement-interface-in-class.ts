// 인터페이스
interface IClicker {
  count: number;
  click(): number;
}

// 인터페이스를 구현한 클래스
class Clicker implements IClicker {
  count: number = 0;

  click(): number {
    this.count++;
    console.log(`Click! [count] : ${this.count}`);
    return this.count;
  }
}

const clicker = new Clicker();

clicker.click();
clicker.click();
clicker.click();