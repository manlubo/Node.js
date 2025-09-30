const express = require("express");
const app = express();

const port = 3000;

app.get("/", (req, res) => {
  // 헤더값 설정
  res.set({"content-type": "text/html; charset=utf-8"});
  res.end("Hello Express!");
});

// 서버 실행 후 클라이언트 요청을 기다림
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})