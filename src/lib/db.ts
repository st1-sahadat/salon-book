import { MongoClient, Db } from "mongodb";

const uri = process.env.DB_URI || "";

declare global {
  var _mongoClient: MongoClient | undefined;
  var _mongoDb: Db | undefined;
}

let cachedClient: MongoClient | null = global._mongoClient || null;
let cachedDb: Db | null = global._mongoDb || null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!uri) {
    throw new Error("Please add your DB_URI to environment variables.");
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("salon-book");

  cachedClient = client;
  cachedDb = db;
  global._mongoClient = client;
  global._mongoDb = db;

  return { client, db };
}
