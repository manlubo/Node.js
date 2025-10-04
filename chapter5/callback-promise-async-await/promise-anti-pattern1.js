function myWork(work) {
  return new Promise((resolve, reject) => {
    if (work === 'done') {
      resolve('게임 가능');
    }
    else {
      reject(new Error("게임 불가능"));
    }
  })
}

// then 내부에서 else 처리하는 것은 콜백과 다를 것이 없음
myWork('done').then(function (value) {console.log(value)}, function (error) {
  console.error(error)});

// catch로 처리하는 것이 보기 좋음
myWork('doing')
.then(function (value) {
  console.log(value);
})
.catch(function (error) {
  console.error(error);
})

