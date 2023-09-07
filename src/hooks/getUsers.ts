import { MongoClient } from "mongodb";
// import { config } from "./config/config";
const client = new MongoClient("mongodb+srv://User1:1234@systemcluster.hwra6cw.mongodb.net/"); 
await client.connect();

export async function getUsers(collectionName: string) {
  const database = client.db("Online-Exam-System"); 

  return database.collection(collectionName);
}