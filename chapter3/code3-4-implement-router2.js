const http = require("http");
// url 모듈을 로딩
const url = require("url");

http.createServer((req, res) => {
  // 패스명을 할당
  const path = url.parse(req.url, true).pathname;
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  // 패스명에 따라 결과 분기처리
  if(path === "/user"){
    user(req, res);
  } else if(path === "/feed") {
    feed(req, res);
  } else {
    notFound(req, res)
  }
})
.listen("3000", () => console.log("라우터를 만들어보자"));

const user = (req, res) => {
  const userInfo = url.parse(req.url, true).query;
  res.end(`[user] name : ${userInfo.name}, age: ${userInfo.age}`);
}

const feed = (req, res) => {
  res.end(`<ul>
    <li>picture1</li>
    <li>picture2</li>
    <li>picture3</li>
  `);
}

const notFound = (req, res) => {
  res.statusCode = 404;
  res.end("404 Page Not Found");
}