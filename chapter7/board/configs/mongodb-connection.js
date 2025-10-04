import {MongoClient} from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = `${process.env.DB_URI}`;
console.log(uri);
export default function MongodbConnection(callback) {
  return MongoClient.connect(uri, callback);
}

