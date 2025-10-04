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

## [chapter5]
- 콜백 함수 사용
```javascript
function register(user) {
  return saveDB(user, function (user) {
    return sendEmail(user, function (user) {
      return getResult(user);
    });
  })
}
```
- Promise 객체 사용
```javascript
function goodPromise(val) {
  return new Promise((resolve, reject) => {
    // resolve : 성공 시, reject: 실패 시
    resolve(val);
  });
}

goodPromise("세상에")
  .then((val) => {
    return val + " 이런";
  })
  .then((val) => {
    return val + " 코드는";
  })
  .then((val) => {
    return val + " 없습니다.";
  })
  .then((val) => {
    console.log(val);
  })
  .catch((err) => {
    console.log(err);
  });
```
- async & await 사용
```javascript
function waitOneSecond(msg) {
  return new Promise((resolve, _) => {
    setTimeout(() => resolve(`${msg}`), 1000);
  });
}

// async 함수 안에서 await은 해당 비동기 작업이 끝날 때까지 다음 코드 실행을 멈춤
async function countOneToTen() {
  for (let x of [...Array(10).keys()]) { // 0 ~ 9까지의 루프를 순회
    let result = await waitOneSecond(`${x + 1}초 대기중...`);
    console.log(result);
  }
  console.log("완료");
}

countOneToTen();
```
---
## [chapter6]
- 몽고DB 가입
- 의존성 설치
```bash
# 몽고DB 의존성
npm i mongodb
# .env 의존성
npm i dotenv
```
- DB연결
```javascript
import { MongoClient, ServerApiVersion} from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// 아이디, 비밀번호, 클러스터 정보는 .env 파일로 관리(같은 패키지에 생성)
const uri = `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  await client.connect();
  const adminDB = client.db("test").admin();
  const listDatabases = await adminDB.listDatabases();
  console.log(listDatabases);
  return "OK";
}

run()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
```
- 간단한 CRUD 제작
```javascript
// 몽고 클라이언트 모듈 추가
import { MongoClient } from 'mongodb';

// 몽고 클라이언트 생성
const client = new MongoClient(url);

// await 사용을 위해 async 함수 사용
async function main() {
  try {
    // 커넥션 생성 및 연결 시도
    await client.connect();
    console.log("MongoDB 접속 성공");

    // test 데이터베이스의 person 컬렉션 가져오기
    const collection = client.db('test').collection('person');

    // 문서 하나 추가
    await collection.insertOne({name: 'manlubo', age: 30});
    console.log("문서 추가 완료");

    // 문서 찾기
    const documents = await collection.find({name: 'manlubo'}).toArray();
    console.log('찾은 문서: ', documents);

    // 문서 갱신하기
    await collection.updateOne({name: 'manlubo'}, {$set: {age: 31}});
    console.log('문서 업데이트');

    // 갱신된 문서 확인하기
    const updatedDocuments = await collection.find({name: 'manlubo'}).toArray();
    console.log('갱신된 문서: ', updatedDocuments);

    // 문서 삭제하기
    await collection.deleteOne({name: 'manlubo'});
    console.log('문서 삭제')

    // 연결 끊기
    await client.close();
  } catch (err) {
    console.log(err);
  }
}
```

- MongoDB 연산자

  | 연산자        | 설명                                               |
  |---------------|----------------------------------------------------|
  | $set          | 도큐먼트의 속성값을 변경할 때 사용                  |
  | $unset        | 도큐먼트의 속성을 삭제할 때 사용                    |
  | $rename       | 도큐먼트 속성의 이름을 변경할 때 사용                |
  | $inc          | 필드의 값을 증가시킬 때 사용                        |
  | $mul          | 필드의 값에 곱하기를 할 때 사용                     |
  | $min          | 지정한 값과 현잿값 중 작은 값을 선택                 |
  | $max          | 지정한 값과 현잿값 중 큰 값을 선택                   |
  | $currentDate  | 현재 날짜와 시간을 필드에 업데이트                   |
  | $addToSet     | 배열 필드에 값이 없는 경우 추가                      |
  | $pop          | 배열 필드에서 첫 번째 혹은 마지막 값을 삭제           |
  | $pull         | 배열 필드에서 조건에 맞는 모든 값을 삭제              |
  | $push         | 배열 필드의 끝에 값 추가                             |
  | $each         | 여러 개의 값을 한 번에 배열 필드에 추가               |

- [MongoDB compass 다운로드하기](https://www.mongodb.com/try/download/compass)

- 몽구스 설치
```bash
 npm i mongoose
```
- 몽구스로 스키마 만들기
```javascript
import mongoose, {Schema} from "mongoose";

// 스키마 객체 생성
const personSchema = new Schema({
  name: String,
  age: Number,
  email: { type: String, required: true },
});

// 모델 객체 생성
export default mongoose.model("Person", personSchema);
```
- 스키마 선언 타입 
 
 | 타입       | 설명                   |
  |------------|----------------------|
  | String     | 문자열                  |
  | Number     | 숫자                   |
  | Date       | 날짜                   |
  | Buffer     | 버퍼                   |
  | Boolean    | 불린 값                 |
  | Mixed      | 임의 타입 (아무 값이나 저장 가능) |
  | ObjectId   | 고유한 식별자              |
  | Array      | 배열은 []로 선언           |
  | Decimal128 | 고정 소수점(128비트)        |
  | Map        | 자바스크립트 Map의 하위 클래스   |

- 스키마 추가 속성

| 속성       | 타입                  | 설명                                           |
  |------------|-----------------------|----------------------------------------------|
  | required   | Boolean / Function    | 필수 여부 지정 (true면 값이 없을 경우 ValidationError 발생) |
  | default    | Any / Function        | 기본값 지정 (값이 없을 때 자동 할당)                       |
  | select     | Boolean               | 쿼리 시 기본으로 선택할지 여부 (false면 기본적으로 조회 제외)       |
  | validate   | Function / Object     | 사용자 정의 유효성 검사 함수 지정                          |
  | get        | Function              | 값 조회 시 호출되는 Getter 함수                        |
  | set        | Function              | 값 저장 시 호출되는 Setter 함수                        |
  | alias      | String                | 필드에 대한 가상 별칭 지정 (다른 이름으로 접근 가능)              |
  | immutable  | Boolean / Function    | true면 한 번 값이 설정되면 변경 불가                      |
  | transform  | Function              | toJSON / toObject 변환 시 필드값 변환용 함수            |
  | index      | Boolean / Object      | 인덱스 생성 여부 (true 또는 상세 옵션 가능)                 |
  | unique     | Boolean               | 고유 값 여부 (DB 레벨에서 unique 인덱스 생성)              |
  | sparse     | Boolean               | 희소 인덱스 생성 여부 (null/undefined 값은 인덱스에서 제외)    |

---

## [chapter7]
- express + express-handlebars + MongoDB (mvc패턴 적용)
```bash
# 머스태치 같은 템플릿 엔진
npm i express-handlebars
```
```javascript
//app.js
import express from 'express';
import {engine} from "express-handlebars";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// 템플릿 엔진으로 핸들바 등록
app.engine('handlebars', engine());
// 웹피이지 로드 시 사용할 템플릿 엔진 설정
app.set('view engine', 'handlebars');
// 뷰 디렉토리를 views로 설정
app.set('views', __dirname + '/views');

app.get("/", (req, res) => {
  res.render("home", {title: "안녕하세요", message: "만나서 반갑습니다!"});
});

app.listen(3000);
```
```html
<!-- views/layouts/main.handlebars -->
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>게시판 프로젝트</title>
</head>
<body>
<!--중괄호 3개로 감싸야함-->
  {{{ body }}}
</body>
</html>
```
```html
<!-- views/home.handlebars -->
<h2>{{title}}</h2>
<p>{{message}}</p>
```
- 저장시 서버 자동 재시작 설정 [nodemon]
```bash
npm i nodemon 
```
```json
// package.json
"scripts": {
"test": "echo \"Error: no test specified\" && exit 1",
"start": "npx nodemon app.js" // npx로 자동 재시작 설정 가능
},
```
