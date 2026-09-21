import { connectDB } from "@/lib/mongodb";
import { TimeRecord } from "@/models/TimeRecord";

// 每次呼叫都寫入一筆當下時間，供 cron-job.org 以 GET 定時呼叫
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error("未設定 CRON_SECRET，拒絕所有請求");
    return Response.json({ error: "伺服器設定錯誤" }, { status: 500 });
  }

  if (request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

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
