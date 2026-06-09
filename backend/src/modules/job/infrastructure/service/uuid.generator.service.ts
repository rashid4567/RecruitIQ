import crypto from "crypto";
import { IdGenerator } from "../../application/ports/id.generator.prots"; 

export class UUIDGenerator implements IdGenerator {
  generate(): string {
    return crypto.randomUUID();
  }
}