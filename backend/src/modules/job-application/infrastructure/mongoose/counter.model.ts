import { Schema, model } from "mongoose";

export interface CounterDocument {
  _id: string;
  sequence: number;
}

const CounterSchema = new Schema<CounterDocument>(
  {
    _id: {
      type: String,
      required: true,
    },
    sequence: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false },
);
export const CounterModel = model<CounterDocument>("Counter", CounterSchema);
