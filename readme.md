# Node.js 백엔드 학습

### [chapter2]
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

### [chapter3]
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