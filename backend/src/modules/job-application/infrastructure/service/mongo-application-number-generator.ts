import { ApplicationNumberGenerator } from "../../domain/service/application-number-generator";
import { CounterModel } from "../mongoose/counter.model";

export class MongoApplicationNumberGenerator implements ApplicationNumberGenerator {
  async generate(): Promise<string> {
    const counter = await CounterModel.findOneAndUpdate(
      { _id: "application" },
      { $inc: { sequence: 1 } },
      {
        new: true,
        upsert: true,
      },
    );

    return `APP-${counter.sequence.toString().padStart(6, "0")}`;
  }
}
