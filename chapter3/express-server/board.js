import express from "express";

const app = express();
// 게시글 리스트로 사용할 posts에 빈 리스트 할당
let posts = [];
let postId = 1;

// req.body를 사용하려면 json미들웨어를 사용해야함
// 사용하지 않으면 undefined로 반환됨
app.use(express.json());

// POST 요청 시 컨텐트 타입이 application/x-www-form-urlencoded인 경우 파싱
// JSON 미들웨어와 함께 사용
app.use(express.urlencoded({ extended: true }));

// /로 요청이오면 실행
app.get("/", (req, res) => {
  // 게시글 리스트를 json형식으로 보여줌
  res.json(posts);
})

// /posts로 요청이 오면 실행
app.post("/posts", (req, res) => {
  // http요청의 body 데이터를 변수에 할당
  const { title, name, text } = req.body;

  // 게시글 리스트에 새로운 게시글 정보 추가
  posts.push({ id: postId++, title, name, text, regdate: Date() });
  res.json({ title, name, text });
});

app.delete("/posts/:id", (req, res) => {
  // app.delete에 설정한 path 정보에서 id값을 가져옴
  const id = req.params.id;
  // 글 삭제 로직
  const filteredPosts = posts.filter((post) => post.id !== +id);
  // 삭제 확인
  const isLengthChanged = posts.length !== filteredPosts.length;

  posts = filteredPosts;
  if(isLengthChanged) {
    res.json("OK");
    return;
  }
  res.json("Not Changed");
});

app.listen(3000, () => {
  console.log("게시판 Server started on port 3000");
})