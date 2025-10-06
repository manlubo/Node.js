interface WebtoonCommon {
  title: string;
  regDate: Date;
  modDate: Date;
}

interface Episode extends WebtoonCommon {
  episodeNumber: number;
  seriesNumber: number;
}

interface Series extends WebtoonCommon {
  seriesNumber: number;
  author: string;
}

const episode: Episode = {
  title: "나 혼자만 레벨업 1화",
  regDate: new Date(),
  modDate: new Date(),
  episodeNumber: 1,
  seriesNumber: 123,
}

const series: Series = {
  title: "나 혼자만 레벨업",
  regDate: new Date(),
  modDate: new Date(),
  seriesNumber: 123,
  author: "천재 작가",
}

console.log(episode);
console.log(series);