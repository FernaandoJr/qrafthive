import { MongoClient, Db } from "mongodb";
import { env } from "../config/env";

class Database {
  private static instance: Database;
  private client: MongoClient;
  private db: Db | null = null;

  private constructor() {
    this.client = new MongoClient(env.MONGODB_URI);
  }

  static getInstance(): Database {
    if (!Database.instance) Database.instance = new Database();
    return Database.instance;
  }

  async connect(): Promise<Db> {
    if (this.db) return this.db;

    await this.client.connect();
    this.db = this.client.db();
    console.log("✅ MongoDB conectado");
    return this.db;
  }

  async getDb(): Promise<Db> {
    if (!this.db) {
      await this.connect();
    }
    return this.db!;
  }

  async disconnect(): Promise<void> {
    await this.client.close();
    this.db = null;
  }
}

export const database = Database.getInstance();