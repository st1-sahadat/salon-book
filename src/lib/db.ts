import { MongoClient, Db } from "mongodb";

const uri = process.env.DB_URI;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!uri) {
    throw new Error("Please add your DB_URI to .env");
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("salon-book");

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
