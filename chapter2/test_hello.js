import http from "k6/http";

// 성능 테스트 옵션값
export const options = {
  // 가상유저: 100명
  vus: 50,
  // 10초동안 계속 요청을 보냄
  duration: "5s",
};

export default function (){
  http.get("http://localhost:8080/");
}