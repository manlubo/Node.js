import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const url = `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/test?retryWrites=true&w=majority`;

// 몽고 클라이언트 생성
const client = new MongoClient(url);

async function main() {
  try {
    // 커넥션 생성 및 연결 시도
    await client.connect();
    console.log("MongoDB 접속 성공");

    // test 데이터베이스의 person 컬렉션 가져오기
    const collection = client.db('test').collection('person');

    // 문서 하나 추가
    await collection.insertOne({name: 'Eunbi', age: 30});
    console.log("문서 추가 완료");

    // 문서 찾기
    const documents = await collection.find({name: 'Eunbi'}).toArray();
    console.log('찾은 문서: ', documents);

    // 문서 갱신하기
    await collection.updateOne({name: 'Eunbi'}, {$set: {age: 31}});
    console.log('문서 업데이트');

    // 갱신된 문서 확인하기
    const updatedDocuments = await collection.find({name: 'Eunbi'}).toArray();
    console.log('갱신된 문서: ', updatedDocuments);

    // 문서 삭제하기
    // await collection.deleteOne({name: 'Eunbi'});
    // console.log('문서 삭제')

    // 연결 끊기
    await client.close();
  } catch (err) {
    console.log(err);
  }
}

main();