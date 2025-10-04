import express from 'express';
import mongoose from "mongoose";
import * as bodyParser from "express";
import dotenv from "dotenv";
import Person from "./person-model.js";

dotenv.config();


// 설정해주어야 경고가 뜨지 않음
mongoose.set("strictQuery", false);

const app = express();

// http에서 Body를 파싱하기 위해 설정
app.use(bodyParser.json());
app.listen(3000, async() => {
  console.log("Server started");
  const mongodbUri = `${process.env.DB_URI}`;

  // 몽고디비에 커넥션 맺기
  mongoose
    .connect(mongodbUri)
    .then(console.log("MongoDB Connected"));
});

// 모든 person 데이터 출력
app.get("/person", async (req, res) => {
  const person = await Person.find({});
  res.json(person);
});

// 특정 이메일로 person 찾기
app.get("/person/:email", async (req, res) => {
  const person = await Person.findOne({email: req.params.email });
  res.json(person);
});

// person 데이터 추가하기
app.post("/person", async (req, res) => {
  const person = new Person(req.body);
  await person.save();
  res.send(person);
});

// person 데이터 수정하기
app.put("/person/:email", async (req, res) => {
  const person = await Person.findOneAndUpdate(
    {email: req.params.email },
    {$set: req.body},
    {new: true},
  );
  console.log(person);
  res.send(person);
});

// person 데이터 삭제하기
app.delete("/person/:email", async (req, res) => {
  await Person.deleteMany({email: req.params.email });
  res.send({success: true});
});