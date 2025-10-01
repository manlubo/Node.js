import express from 'express';

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`익스프레스로 라우터 리팩토링하기`);
})

app.get("/", (_, res) => res.end("HOME"));
app.get("/user", user);
app.get("/feed", feed);

function user(req, res) {
  const myUrl = new URL(req.url, `http://${req.headers.host}`);
  const name = myUrl.searchParams.get("name");
  const age = myUrl.searchParams.get("age");

  res.json(`[user] name : ${name}, age: ${age}`);
}

function feed(req, res) {
  res.json(`<ul>
    <li>picture1</li>
    <li>picture2</li>
    <li>picture3</li>
  `);
}