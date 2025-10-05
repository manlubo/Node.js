import paginator from "../utils/paginator.js";
import {ObjectId} from "mongodb";

// 게시글 작성
export async function writePost(collection, post) {
  post.hits = 0;
  post.regDate = new Date().toISOString();
  return await collection.insertOne(post);
}


// 리스트 ( 검색어 포함 )
export async function list(collection, page, search) {
  const perPage = 10;

  // title이 search와 부분 일치하는지 확인
  const query = {title: new RegExp(search, "i")};

  // limit은 10개만 가져온다는 의미, skip은 설정된 개수만큼 건너뜀.
  // 생성일 역순으로 정렬
  const cursor = collection.find(query, {limit: perPage, skip: (page - 1) * perPage}).sort({
    regDate: -1,
  });

  // 검색어에 걸리는 게시물의 총합
  const totalCount = await collection.count(query);
  // 커서로 받아온 데이터를 리스트로 변경
  const posts = await cursor.toArray();

  // 페이지네이터 생성
  const paginatorObj = paginator({totalCount, page, perPage});
  return [posts, paginatorObj];
}

// 가져올 때, 제외할 데이터 정의
export const projectionOption = {
  projection: {
    password: 0,
    "comments.password": 0,
  },
};


// 게시글 단일 조회
export async function read(collection, id){
  return await collection.findOneAndUpdate({_id: new ObjectId(id)}, {$inc: {hits: 1}}, projectionOption);
}


// 게시글 비밀번호 검증
export async function getPostByIdAndPassword(collection, {id, password}) {
  return await collection.findOne({_id: new ObjectId(id), password: password }, projectionOption);
}

// id로 게시글 불러오기
export async function getPostById(collection, id){
  return await collection.findOne({_id: new ObjectId(id)}, projectionOption);
}

// 게시글 수정
export async function updatePost(collection, id, post) {
  const toUpdatePost = {
    $set: {
      ...post,
    }
  }
  return await collection.updateOne({_id: new ObjectId(id)}, toUpdatePost);
}

// 게시글 삭제
export async function deleteOne(collection, {id, password}) {
  return await collection.deleteOne({_id: new ObjectId(id), password: password});
}