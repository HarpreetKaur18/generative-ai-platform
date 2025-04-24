import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
const dbName = "gai-platform";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await client.connect(); // always connect (Mongo reuses the connection internally)

    const db = client.db(dbName);
    const logs = await db.collection("logs").find().sort({ createdAt: -1 }).toArray();

    res.status(200).json(logs);
  } catch (err) {
    console.error("❌ Failed to load logs:", err);
    res.status(500).json({ error: "Failed to load logs" });
  }
}
