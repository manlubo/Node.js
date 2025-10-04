function myWork(work) {
  return new Promise((resolve, reject) => {
    resolve(work.toUpperCase());
  })
}

function playGame(work) {
  return new Promise((resolve, reject) => {
    if (work === "DONE") {
      resolve("GO PLAY GAME");
    }
    else {
      reject(new Error("DON'T"))
    }
  })
}

myWork("DONE")
  .then(function (result) {
    playGame(result).then(function (val) {
      console.log(val);
    });
  });

myWork("DONE")
.then(playGame)
.then(console.log)