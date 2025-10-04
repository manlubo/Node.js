const axios = require("axios");

// await 사용을 위해 async를 붙임
async function getTop20Movies() {
  const url = "https://raw.githubusercontent.com/wapj/jsbackend/main/movieinfo.json";
  try{
    // 네트워크에서 데이터를 받아올때까지 기다리기 위해 await 사용
    const result = await axios.get(url);
    const { data } = result; // result에는 data 프로퍼티가 있음
    // 데이터가 없거나, 빈 리스트일 때 예외 처리
    if (!data.articleList || data.articleList.size === 0) {
      throw new Error("데이터가 없습니다.")
    }
    // 데이터에서 사용할 정보 가공
    const movieInfos = data.articleList.map((article, idx) => {
      return { title: article.title, rank: idx + 1 };
    });

    // 데이터 출력
    for(let movieInfo of movieInfos) {
      console.log(`[${movieInfo.rank}위] ${movieInfo.title}`);
    }
  } catch(err) {
    // 예외처리는 try catch로 감쌈
    throw new Error(err);
  }
}

// 함수 호출
getTop20Movies();