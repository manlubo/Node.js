abstract class Logger {
  prepare() {
    console.log("========");
    console.log("로그를 남기기 위한 준비")
  }

  log(message: string) {
    this.prepare();
    this.execute(message);
    this.complete();
  }

  abstract execute(message: string): void;

  complete() {
    console.log("작업 완료")
    console.log("")
  }
}

class FileLogger extends Logger {
  fileName: string;

  constructor(fileName: string) {
    super();
    this.fileName = fileName;
  }
  execute(message: string): void {
    console.log(`[${this.fileName}] > `, message);
  }
}

class ConsoleLogger extends Logger {
  execute(message: string): void {
    console.log(message);
  }
}

const fileLogger = new FileLogger("test.log");
fileLogger.log("로그 남기기 테스트")

const consoleLogger = new ConsoleLogger();
consoleLogger.log("로그 남기기")