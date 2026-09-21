import { connectDB } from "@/lib/mongodb";
import { TimeRecord } from "@/models/TimeRecord";

// 每次呼叫都寫入一筆當下時間，供 cron-job.org 以 GET 定時呼叫
export async function GET() {
  try {
    await connectDB();
    const record = await TimeRecord.create({ recordedAt: new Date() });

    return Response.json({
      id: record._id.toString(),
      recordedAt: record.recordedAt.toISOString(),
    });
  } catch (error) {
    console.error("寫入時間資料失敗:", error);
    return Response.json({ error: "寫入時間資料失敗" }, { status: 500 });
  }
}
