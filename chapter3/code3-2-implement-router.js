const http = require("http");
// url 모듈을 로딩
const url = require("url");

http.createServer((req, res) => {
  // 패스명을 할당
  const path = url.parse(req.url, true).pathname;
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  // 패스명에 따라 결과 분기처리
  if(path === "/user"){
    res.end("[user] name : 권은비, age: 30");
  } else if(path === "/feed") {
    res.end(`<ul>
    <li>picture1</li>
    <li>picture2</li>
    <li>picture3</li>
  `);
  } else {
    res.statusCode = 404;
    // 에러 메시지 설정
    res.end("404 Page Not Found");
  }
})
.listen("3000", () => console.log("라우터를 만들어보자"));