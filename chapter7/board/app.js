import express from 'express';
import {create} from "express-handlebars";
import { fileURLToPath } from "url";
import { dirname } from "path";
import mongodbConnection from "./configs/mongodb-connection.js";
import * as hbsHelpers from "./configs/handlebars-helpers.js";
import * as boardService from "./services/post-service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const hbs = create({
  extname: ".handlebars",
  helpers: hbsHelpers,
})

// 템플릿 엔진으로 핸들바 등록
app.engine('handlebars', hbs.engine);
// 웹피이지 로드 시 사용할 템플릿 엔진 설정
app.set('view engine', 'handlebars');
// 뷰 디렉토리를 views로 설정
app.set('views', __dirname + '/views');

app.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const search = req.query.search || "";

  try {
    const [posts, paginator] = await boardService.list(collection, page, search);

    res.render("home", {title: "테스트 게시판", search, paginator, posts});
  } catch (error) {
    console.error(error);
    res.render("home", {title: "테스트 게시판"});
  }
});

app.get("/write", (req, res) => {
  res.render("write", {title: "테스트 게시판"});
})

app.post("/write", async (req, res) => {
  const post = req.body;
  const result = await boardService.writePost(collection, post);
  res.redirect(`/detail/${result.insertedId}`);
})

app.get("/detail/:id", async (req, res) => {
  const result = await boardService.read(collection, req.params.id);
  res.render("detail", {title: "테스트 게시판", post: result});
})




let collection;

app.listen(3000, async () => {
  console.log("Server started");
  const mongoClient = await mongodbConnection();
  // mongoClient.db()로 디비 선택 > collection()으로 컬렉션 선택 후 컬렉션에 할당
  collection = mongoClient.db().collection("post");
  console.log("MongoDB connected")
});