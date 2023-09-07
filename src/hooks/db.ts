import { MongoClient } from "mongodb";

let client: MongoClient;

export async function connectToDB(uri: string) {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }

  return client;
}

export async function getDB(dbName: string) {
  if (!client) {
    throw new Error("Must connect to database before calling getDB");
  }

  return client.db(dbName);
}
