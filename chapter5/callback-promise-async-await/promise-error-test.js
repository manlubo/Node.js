const DB = [];

function saveDB(user) {
  const oldDBSize = DB.length + 1;
  DB.push(user);
  console.log(`save ${user.name} to DB`);

  // 콜백 대신 Promise 객체 반환
  return new Promise((resolve, reject) => {
    if (DB.length > oldDBSize) {
      // 성공 시 유저 정보 반환
      resolve(user);
    } else {
      // 실패 시 에러 발생
      reject(new Error("Save DB Error!"));
    }
  });
}

function sendEmail(user) {
  console.log(`email to ${user.email}`);
  return new Promise((resolve) => {
    resolve(user);
  });
}

function getResult(user) {
  return new Promise((resolve) => {
    resolve(`success register ${user.name}`);
  })
}


function registerByPromise(user) {
  const result = saveDB(user)
    .then(sendEmail)
    .then(getResult)
    .catch(error => new Error(error)) // 에러 발생 시 캐치
    .finally(() => console.log("완료!")); // 성공 여부와 관계없이 실행(자원 회수 관련 코드를 많이 사용)
  console.log(result);
  return result;
}

const myUser = {email: "eunbi@test.com", password: "1234", name: "eunbi"};
const result = registerByPromise(myUser);
result.then(console.log);

// 동시에 프로미스 객체 호출
// allResult = Promise.all([saveDB(myUser), sendEmail(myUser), getResult(myUser)]);
// allResult.then(console.log);