const http = require("http");

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/html");
  // OK를 응답하고 종료
  res.end("OK");
});

server.listen("3000", () => console.log("OK 서버 시작!"));