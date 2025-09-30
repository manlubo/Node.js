# Node.js 백엔드 학습

---


## [chapter2]
#### 성능 테스트
[k6-latest-amd64.msi 다운로드하기](https://dl.k6.io/msi/)

```k6 run .\chapter2\test_hello.js``` - 터미널에서  경로 설정후 테스트 파일 실행
- vus명의 가상유저를 만들어 duration초 동안 지속 요청
```
█ TOTAL RESULTS 

    HTTP
    http_req_duration..............: avg=2.01s min=2.01s med=2.01s max=2.02s p(90)=2.02s p(95)=2.02s
      { expected_response:true }...: avg=2.01s min=2.01s med=2.01s max=2.02s p(90)=2.02s p(95)=2.02s
    http_req_failed................: 0.00% 0 out of 150
    http_reqs......................: 150   24.749558/s

    EXECUTION
    iteration_duration.............: avg=2.01s min=2.01s med=2.01s max=2.02s p(90)=2.02s p(95)=2.02s
    iterations.....................: 150   24.749558/s
    vus............................: 50    min=50       max=50
    vus_max........................: 50    min=50       max=50

    NETWORK
    data_received..................: 28 kB 4.6 kB/s
    data_sent......................: 11 kB 1.7 kB/s
```
---

## [chapter3]
- 라우팅 구현(패스별 분기처리)
``` javascript
const url = require("url");
const path = url.parse(req.url, true).pathname;
```
- 요청 및 응답 리팩토링 (메서드 분리)
- 동적 응답 구현 (파라미터 값을 사용해서 응답을 구현)
```javascript
const user = (req, res) => {
  // 쿼리 파라미터를 userInfo에 저장
  const userInfo = url.parse(req.url, true).query;
  res.end(`[user] name : ${userInfo.name}, age: ${userInfo.age}`);
}
```
- 라우터 리팩토링(Map활용)
```javascript
// 패스가 urlMap에 있다면, 맵의 value값으로 적용
if(path in urlMap){
  urlMap[path](req, res);
}

// 이때, urlMap은 구현한 함수보다 하단에 위치해야함.
// const 함수 표현식은 호이스팅 되지 않기 때문. (function은 호이스팅 가능)
const urlMap = {
  "/": (req,res) => res.end("HOME"),
  "/user": user,
  "/feed": feed,
}
```


### [express 프레임워크]
- 간단한 익스프레스 서버 구현
- 라우터 코드를 express로 리팩토링
```javascript
const express = require("express");
const app = express();

// _은 사용하지 않는 변수를 구조상 넣을때 사용하는 방식
app.get("/", (_, res) => res.end("HOME"));
app.get("/user", user);
app.get("/feed", feed);

// 호이스팅을 위해 function으로 변경
function user(req, res) {
  const user = url.parse(req.url, true).query;
  // json으로 변경(charset=utf-8 자동설정)
  res.json(`[user] name : ${user.name}, age: ${user.age}`);
}
```
- 게시판 api 코드 작성 (GET, POST, DELETE)
```javascript
// 게시글 리스트로 사용할 posts에 빈 리스트 할당
let posts = [];
// 아이디로 사용할 초깃값
let postId = 1;

// req.body를 사용하려면 json미들웨어를 사용해야함
// 사용하지 않으면 undefined로 반환됨
app.use(express.json());

// POST 요청 시 컨텐트 타입이 application/x-www-form-urlencoded인 경우 파싱
// JSON 미들웨어와 함께 사용
app.use(express.urlencoded({ extended: true }));

// GET요청
app.get("/", (req, res) => {
  res.json(posts);
})

// POST요청
app.post("/posts", (req, res) => {
  const { title, name, text } = req.body;
  
  posts.push({ id: postId++, title, name, text, regdate: Date() });
  res.json({ title, name, text });
});

// DELETE요청
app.delete("/posts/:id", (req, res) => {
  const id = req.params.id;
  
  const filteredPosts = posts.filter((post) => post.id !== +id);
  const isLengthChanged = posts.length !== filteredPosts.length;

  posts = filteredPosts;
  if(isLengthChanged) {
    res.json("OK");
    return;
  }
  res.json("Not Changed");
});

```