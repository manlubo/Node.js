// require: 모듈을 읽어오는 함수 모듈명과 변수명을 동일하게 설정
const http = require("http");
let count = 0;

// 서버 인스턴트 생성: 요청과 응답객체를 인수로 받음
const server = http.createServer((req, res) => {
  log(count);

  // 요청에 대한 상태코드
  res.statusCode = 200;
  // 헤더정보 세팅
  res.setHeader("Content-Type", "text/plain");
  // 응답 보냄
  res.write("hello\n");
  setTimeout(()=> {
    res.end("Node.js");
  }, 2000);
});

function log(count) {
  console.log((count += 1));
}

// 사용할 포트번호 지정
server.listen(8080, () => console.log("Hello Node.js"));