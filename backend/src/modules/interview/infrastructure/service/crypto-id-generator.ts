import { randomUUID } from "crypto";
import { IdGenerator } from "../../application/ports/id-generator";

export class CryptoIdGenerator implements IdGenerator {
  generate(): string {
    return randomUUID();
  }
}