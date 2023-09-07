import { MongoClient } from "mongodb";
// import { config } from "./config/config";

export async function useDatabase() {
  const client = new MongoClient("mongodb+srv://User1:1234@systemcluster.hwra6cw.mongodb.net/"); 
  await client.connect();
  const database = client.db("Online-Exam-System"); 
  return database;
}

export async function getUsers(collectionName: string) {
  const db = await getDB("your-database-name");
  return db.collection(collectionName);
}