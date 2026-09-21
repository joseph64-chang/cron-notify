import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("請在環境變數中設定 MONGODB_URI");
}

// 開發模式下 HMR 會重複載入模組，把連線快取在 globalThis 避免重複建立連線
const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseCache?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

const cache = (globalWithMongoose.mongooseCache ??= {
  conn: null,
  promise: null,
});

export async function connectDB() {
  if (cache.conn) return cache.conn;

  cache.promise ??= mongoose.connect(MONGODB_URI!, { bufferCommands: false });

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null;
    throw error;
  }

  return cache.conn;
}
