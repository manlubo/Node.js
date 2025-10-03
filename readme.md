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
> ESM 방식 사용 - package.json 추가.
> ```json
> "type": "module"
> ```
- 간단한 익스프레스 서버 구현
- 라우터 코드를 express로 리팩토링
```javascript
// commonjs 방식(이전방식)
const express = require("express");
// ESM 방식(최근) - 이제부터는 해당 방식으로 사용할 것임.
import express from 'express';

const app = express();

// _은 사용하지 않는 변수를 구조상 넣을때 사용하는 방식
app.get("/", (_, res) => res.end("HOME"));
app.get("/user", user);
app.get("/feed", feed);

// 호이스팅을 위해 function으로 변경
function user(req, res) {
  // ESM에서는 new URL 클래스 사용 + searchParams 활용
  const myUrl = new URL(req.url, `http://${req.headers.host}`);
  const name = myUrl.searchParams.get("name");
  const age = myUrl.searchParams.get("age");

  res.json(`[user] name : ${name}, age: ${age}`);
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
---
## [chapter4]
- package.json 만들기
```bash
# package.json을 만들 디렉토리로 이동
cd chapter4/sample-package/
# -y 옵션없이 생성 시 터미널에서 직접 내용변경 가능
npm init -y
```
- npm 모듈 만들기
```javascript
// commonjs 방식
console.log("CommonJS");

module.exports = {
  add: (a, b) => a + b,
  sub: (a, b) => a - b,
  multi: (a, b) => a * b,
  div: (a, b) => a / b,
}

// 패키지에서 모듈 불러온 후
const calc = require("sample-package");

const a = 17;
const b = 3;

console.log("a + b = ", calc.add(a, b));
console.log("a - b = ", calc.sub(a, b));
console.log("a * b = ", calc.multi(a, b));
console.log("a / b = ", calc.div(a, b));
```

```javascript
// ESM 방식
console.log("ES Module");

export const add = (a, b) => a + b;
export const sub = (a, b) => a - b;
export const multi = (a, b) => a * b;
export const div = (a, b) => a / b;


// 패키지에서 모듈 불러온 후
import {add, div, multi, sub} from "sample-package";

const a = 17;
const b = 3;

console.log("a + b = ", add(a, b));
console.log("a - b = ", sub(a, b));
console.log("a * b = ", multi(a, b));
console.log("a / b = ", div(a, b));

```
- Node.js 패키지는 시멘틱 버전을 사용
> <메이저>.<마이너>.<패치>
> 
> 메이저 : 기존 버전과 호환되지 않으면 올림
> 
> 마이너 : 기존 버전과 호환되며, 새로운 기능을 추가시 올림
> 
> 패치 : 기존 버전과 호환되며, 버그 수정 시 올림 

### [패키지 설치하기]
```bash
# install 대신 i, add으로 사용해도 별칭(alias)이므로 결과는 동일
npm install <@scope>/<name>@<tag/version/version range>
npm i
npm add

# <@scope> : 패키지 명이 동일할 때, 충돌 발생 방지 가능 ex) @cat/test, @dog/test
# <name>@<tag/version/version range> : 패키지명 / 태그, 버전, 버전범위(생략시 latest)

# -D, --save-dev : devDependencies에 의존성 추가
# -P, --save-prod : dependencies에 의존성 추가 (기본값)
# -G, --global : 프로젝트가 아닌 node가 설치되어있는 디렉터리에 의존성 추가.
```

- 테스트 패키지 설치
```bash
# 개발환경에서만 사용하는 테스트 패키지
npm i jest -D 
```

- 깃 저장소 URL로 패키지 설치
```bash
# npm i <git 저장소 주소>
npm i http://github.com/lodash/lodash # latest
npm i http://github.com/lodash/lodash#4.17.21 #4.17.21ver
```
### [패키지 업데이트]
```bash
npm update
npm up
npm upgrade


# 4.4.2 : 4.4.2로 업데이트
# >4.0.0 : 4.0.0보다 큰 버전 중 최신버전
# <5.0.0 : 5.0.0보다 작은 버전 중 최신버전
# ~1.2.3 : 1.2.3보다 크고, 1.3.0보다 작은 버전 중 최신버전
# ^1.2.3 : 1.2.3보다 크고, 2.0.0보다 작은 버전 중 최신버전
# ^0.1.2 : 0.1.2보다 크고, 0.2.0보다 작은 버전 중 최신버전
```

### [설치한 패키지 확인]
```bash
npm ls [@스코프/] 패키지명
npm list
npm la
npm ll

# --depth=n 옵션으로 설치한 의존성 패키지가 의존하는 패키지도 확인가능
```

### [패키지 삭제]
```bash
npm uninstall [@스코프/] 패키지명[@버전] [-S|--save|-D|--save-dev|-O|--save-optional]
npm remove
npm rm
npm r
npm un
npm unlink
```

### [스크립트 파일 정의]
```json
// package.json에 해당 내용 기입 후 npm run hello로 실행 가능
"scripts": {
    "prehello": "echo 'pre'", // 먼저 실행할 스크립트
    "hello": "echo 'hello Node.js'", // 실행 스크립트
    "posthello": "echo 'post'" // 끝나고 실행할 스크립트
  },

// 실행 결과
$ npm run hello

> test-script@1.0.0 prehello
> echo 'pre'

'pre'

> test-script@1.0.0 hello
> echo 'hello Node.js'

'hello Node.js'

> test-script@1.0.0 posthello
> echo 'post'

'post'
```

### [패키지 잠금] 
- package-lock.json
- 설치 시 올바르게 동작하는 버전을 고정시켜 여러곳에서 동일한 의존성 설치 시 충돌을 차단

### [yarn]
- npm은 용량, 속도, 보안 문제가 있음
- 페이스북에서 문제 해결을 위해 yarn을 만듬
- yarn 설치방법
```bash
# corepack 활성화 - 리눅스/맥에서는 sudo, 윈도우에서는 관리자 모드에서 실행
# npm 이외의 패키지 매니저를 사용하는 기능
corepack enable
# Node.js버전이 낮아서 에러가 날 때
npm i -g corepack

# yarn 설치
yarn init
# 서브 패키지에서 (프로젝트가 아닌) 설치 시
yarn init -p
echo "" > yarn.lock
```
- yarn 명령어
```bash
# 의존성 설치
yarn

# 패키지 설치
yarn add <패키지명>

# 개발용 패키지 설치
yarn add --dev <패키지명>

# 패키지 업데이트
yarn upgrade

# 패키지 삭제
yarn remove <패키지명>

# 스크립트 실행
yarn run

# bin 패키지 실행
yarn <패키지 명령어>
```