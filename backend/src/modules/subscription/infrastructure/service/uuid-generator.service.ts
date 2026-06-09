import crypto from "crypto";
import { IdGenerator } from "../../application/ports/id-generator.port";

export class UUIDGenerator implements IdGenerator {
  generate(): string {
    return crypto.randomUUID();
  }
}