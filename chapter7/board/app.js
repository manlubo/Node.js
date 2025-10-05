import express from 'express';
import {create} from "express-handlebars";
import { fileURLToPath } from "url";
import { dirname } from "path";
import mongodbConnection from "./configs/mongodb-connection.js";
import * as hbsHelpers from "./configs/handlebars-helpers.js";
import * as boardService from "./services/post-service.js";
import {ObjectId} from "mongodb";

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

// 리스트(메인)
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

// 게시글 작성
app.get("/write", (req, res) => {
  res.render("write", {title: "테스트 게시판"});
})

app.post("/write", async (req, res) => {
  const post = req.body;
  const result = await boardService.writePost(collection, post);
  res.redirect(`/detail/${result.insertedId}`);
})

// 게시글 수정
app.get("/modify/:id", async (req, res) => {
  const post = await boardService.getPostById(collection, req.params.id);
  console.log(post);
  res.render("write", {title: "테스트 게시판", mode: "modify", post})
})

app.post("/modify", async (req, res) => {
  const {id, title, writer, password, content} = req.body;

  const post = {
    title, writer, password, content, regDate: new Date().toISOString(),
  };

  const result = boardService.updatePost(collection, id, post);
  res.redirect(`/detail/${id}`);
})

// 게시글 상세
app.get("/detail/:id", async (req, res) => {
  const result = await boardService.read(collection, req.params.id);
  res.render("detail", {title: "테스트 게시판", post: result});
})

// 비밀번호 체크
app.post("/check-password", async (req, res) => {
  const {id, password} = req.body;

  const post = await boardService.getPostByIdAndPassword(collection, {id, password});

  if(!post) {
    return res.status(404).json({isExist: false});
  } else {
    return res.json({isExist: true});
  }
})

// 게시글 삭제
app.delete("/delete", async (req, res) => {
  const {id, password} = req.body;
  try{
    const result = await boardService.deleteOne(collection, {id, password});

    if (result.deletedCount !== 1) {
      console.log("삭제 실패");
      return res.json({isSuccess: false});
    }
    return res.json({isSuccess: true});
  } catch (error) {
    console.error(error);
    return res.json({isSuccess: false});
  }
});

// 댓글 작성
app.post("/write-comment", async (req, res) => {
  const {id, name, password, comment} = req.body;
  const post = await  boardService.getPostById(collection, id);

  if(post.comments){
    post.comments.push({
      idx: post.comments.length + 1,
      name,
      password,
      comment,
      regDate: new Date().toISOString(),
    });
  } else {
    post.comments = [
      {
        idx: 1,
        name,
        password,
        comment,
        regDate: new Date().toISOString(),
      },
    ];
  }

  boardService.updatePost(collection, id, post);
  return res.redirect(`/detail/${id}`);
})

// 댓글 삭제
app.delete("/delete-comment", async (req, res) => {
  const {id, idx, password} = req.body;

  const post = await collection.findOne(
    {
      _id: new ObjectId(id),
      comments: {$elemMatch: {idx: parseInt(idx), password}},
    },
  );

  if(!post) {
    return res.json({isSuccess: false});
  }

  post.comments = post.comments.filter((comment) => comment.idx != idx);
  boardService.updatePost(collection, id, post);
  return res.json({isSuccess: true});
})

let collection;

app.listen(3000, async () => {
  console.log("Server started");
  const mongoClient = await mongodbConnection();
  // mongoClient.db()로 디비 선택 > collection()으로 컬렉션 선택 후 컬렉션에 할당
  collection = mongoClient.db().collection("post");
  console.log("MongoDB connected")
});