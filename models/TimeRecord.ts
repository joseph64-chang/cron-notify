import mongoose, { InferSchemaType, Model } from "mongoose";

const timeRecordSchema = new mongoose.Schema({
  recordedAt: { type: Date, required: true, default: Date.now },
});

export type TimeRecordDoc = InferSchemaType<typeof timeRecordSchema>;

export const TimeRecord: Model<TimeRecordDoc> =
  mongoose.models.TimeRecord ??
  mongoose.model<TimeRecordDoc>("TimeRecord", timeRecordSchema);
